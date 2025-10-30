/**
 * @file AddProjectDialog.tsx
 * @description Dialog component for adding projects
 */

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

interface AddProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: Project) => Promise<void>;
}

export function AddProjectDialog({ isOpen, onClose, onAdd }: AddProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [techStack, setTechStack] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        description: description.trim(),
        url: url.trim() || undefined,
        techStack: techStack
          .split(',')
          .map((tech) => tech.trim())
          .filter((tech) => tech.length > 0),
        image: image.trim() || undefined,
      });
      setName('');
      setDescription('');
      setUrl('');
      setTechStack('');
      setImage('');
      onClose();
    } catch (error) {
      console.error('Failed to add project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Add Project</h2>
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

          <Input
            label="Image URL (Optional)"
            placeholder="e.g., https://example.com/project-image.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

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
              {isSubmitting ? 'Adding...' : 'Add Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
