/**
 * @file EditProjectDialog.tsx
 * @description Dialog component for editing projects
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (index: number, project: Project) => Promise<void>;
  project: Project | null;
  projectIndex: number;
}

export function EditProjectDialog({ isOpen, onClose, onUpdate, project, projectIndex }: EditProjectDialogProps) {
  const { user } = useAuth();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [techStack, setTechStack] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      const response = await fetch('/api/project/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { imageUrl } = await response.json();
      setImage(imageUrl);
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (project && isOpen) {
      setName(project.name || '');
      setDescription(project.description || '');
      setUrl(project.url || '');
      setTechStack(project.techStack?.join(', ') || '');
      setImage(project.image || '');
    }
  }, [project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdate(projectIndex, {
        name: name.trim(),
        description: description.trim(),
        url: url.trim() || undefined,
        techStack: techStack
          .split(',')
          .map((tech) => tech.trim())
          .filter((tech) => tech.length > 0),
        image: image.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g., E-commerce Platform"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            label="Description"
            placeholder="Describe your project and its features..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />

          <Input
            label="Project URL (Optional)"
            placeholder="e.g., https://github.com/username/project"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div>
            <Input
              label="Tech Stack"
              placeholder="e.g., React, TypeScript, Tailwind CSS (comma-separated)"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
            />
            <p className="text-xs text-text-muted mt-1">
              Enter technologies separated by commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Project Banner Image (Optional)
            </label>
            {image && (
              <div className="mb-3 relative">
                <img
                  src={image}
                  alt="Project preview"
                  className="w-full h-32 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploadingImage}
              className="w-full"
            >
              {uploadingImage ? (
                <>Uploading...</>
              ) : image ? (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Change Image
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
            <p className="text-xs text-text-muted mt-1">
              Max 5MB • JPG, PNG, GIF, WebP
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting || !name.trim() || !description.trim()}
            >
              {isSubmitting ? 'Updating...' : 'Update Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
