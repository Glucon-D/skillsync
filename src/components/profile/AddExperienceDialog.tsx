/**
 * @file AddExperienceDialog.tsx
 * @description Dialog component for adding experience
 */

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Experience } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

interface AddExperienceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (experience: Experience) => Promise<void>;
}

export function AddExperienceDialog({ isOpen, onClose, onAdd }: AddExperienceDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [techStack, setTechStack] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !duration.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim(),
        techStack: techStack
          .split(',')
          .map((tech) => tech.trim())
          .filter((tech) => tech.length > 0),
      });
      setTitle('');
      setDescription('');
      setDuration('');
      setTechStack('');
      onClose();
    } catch (error) {
      console.error('Failed to add experience:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Add Experience</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Job Title"
            placeholder="e.g., Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Duration"
            placeholder="e.g., Jan 2022 - Present"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />

          <Textarea
            label="Description"
            placeholder="Describe your role and achievements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />

          <div>
            <Input
              label="Tech Stack"
              placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
            />
            <p className="text-xs text-text-muted mt-1">
              Enter technologies separated by commas
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
              disabled={isSubmitting || !title.trim() || !description.trim() || !duration.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add Experience'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
