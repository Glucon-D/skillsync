interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterOptions {
  model: string;
  systemPrompt?: string;
  messages?: Message[];
  maxTokens?: number;
  temperature?: number;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function callOpenRouter({
  model,
  systemPrompt,
  messages = [],
  maxTokens = 1000,
  temperature = 0.7,
}: OpenRouterOptions): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables');
  }

  const conversationMessages: Message[] = [];

  if (systemPrompt) {
    conversationMessages.push({
      role: 'system',
      content: systemPrompt,
    });
  }

  conversationMessages.push(...messages);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'SkillSync',
      },
      body: JSON.stringify({
        model,
        messages: conversationMessages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`
      );
    }

    const data: OpenRouterResponse = await response.json();

    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    throw error;
  }
}

// Quick helper for simple prompts
export async function quickPrompt(
  model: string,
  userPrompt: string,
  systemPrompt?: string
): Promise<string> {
  return callOpenRouter({
    model,
    systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
}
