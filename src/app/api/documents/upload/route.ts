import { NextRequest, NextResponse } from 'next/server';
import { Client, Storage, ID } from 'node-appwrite';
import { callOpenRouter } from '@/lib/openrouter';
import pdfParse from 'pdf-parse-fork';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const storage = new Storage(client);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      );
    }

    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

    // Upload to Appwrite Storage
    const fileId = ID.unique();
    await storage.createFile(bucketId, fileId, file);

    // Get file URL for viewing
    const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

    // Read file content for AI analysis
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use OpenRouter to extract information
    let extractedData = {};
    let summary = 'Document uploaded successfully';

    try {
      let textContent = '';

      // Extract text based on file type
      const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const isTextFile = file.type.includes('text') || file.name.endsWith('.txt');

      if (isPDF) {
        // Parse PDF and extract text
        console.log('📄 Parsing PDF:', file.name);
        const pdfData = await pdfParse(buffer);
        textContent = pdfData.text;
        console.log('📄 PDF text extracted, length:', textContent.length);
      } else if (isTextFile) {
        // For text files, read directly
        textContent = buffer.toString('utf-8');
      } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        // For Word docs, we'd need another library (mammoth), skip for now
        textContent = `Document: ${file.name}`;
      } else {
        // For images or other files, use filename
        textContent = `Document: ${file.name}`;
      }

      // Send extracted text to AI for analysis
      if (textContent && textContent.trim().length > 10) {
        console.log('🤖 Calling AI to analyze document...');

        const aiResponse = await callOpenRouter({
          model: 'google/gemini-2.5-flash-lite',
          systemPrompt: 'You are an expert document analyzer. Extract relevant information based on what the document contains. Return ONLY valid JSON.',
          messages: [
            {
              role: 'user',
              content: `Analyze this document and extract ALL relevant information. Return JSON with a summary and any applicable fields:

${textContent.slice(0, 8000)}

Return valid JSON with these fields (only include fields that have actual data):
{
  "summary": "Brief 2-3 sentence summary",
  "documentType": "resume/certificate/transcript/invoice/learning_path/other",
  "grades": ["any GPA or grades"],
  "skills": ["any technical or soft skills"],
  "achievements": ["awards or achievements"],
  "education": ["degrees or schools"],
  "experience": ["work experience or projects"],
  "certifications": ["certifications or licenses"],
  "courses": ["courses or learning topics"],
  "projects": ["projects mentioned"],
  "technologies": ["technologies or tools"],
  "other": ["any other important info"]
}

Do NOT include fields with empty arrays. Return ONLY the JSON object.`
            }
          ],
          temperature: 0.2,
          maxTokens: 2000,
        });

        console.log('🤖 AI Response received:', aiResponse.substring(0, 200));

        // Parse AI response - aggressively handle markdown and extract JSON
        let jsonStr = aiResponse.trim();

        // Remove ALL markdown code blocks
        jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        // Extract JSON object
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            summary = parsed.summary || `${file.name} document`;
            delete parsed.summary;
            delete parsed.documentType; // Don't store this in extractedData

            // Remove empty fields
            Object.keys(parsed).forEach(key => {
              if (Array.isArray(parsed[key]) && parsed[key].length === 0) {
                delete parsed[key];
              }
            });

            extractedData = parsed;
            console.log('✅ Document analyzed successfully');
          } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            console.log('Raw JSON string:', jsonMatch[0].substring(0, 200));
            summary = `${file.name} - Parse error`;
          }
        } else {
          console.warn('⚠️ No JSON found in AI response');
          console.log('Full response:', aiResponse);
          summary = `${file.name} - AI response invalid`;
        }
      } else {
        console.warn('⚠️ No text content extracted from file');
        summary = `${file.name} - No text content`;
      }
    } catch (e) {
      console.error('❌ Document parsing failed:', e);
      const fileName = file.name.toLowerCase();
      if (fileName.includes('resume') || fileName.includes('cv')) {
        summary = 'Resume/CV document - Parse error';
      } else if (fileName.includes('certificate') || fileName.includes('cert')) {
        summary = 'Certificate document - Parse error';
      } else if (fileName.includes('transcript')) {
        summary = 'Academic transcript - Parse error';
      } else {
        summary = `${file.name} - Parse error`;
      }
    }

    // Return document metadata
    const documentMetadata = {
      id: fileId,
      name: file.name,
      url: fileUrl,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      summary,
      extractedData,
    };

    return NextResponse.json({ document: documentMetadata });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
