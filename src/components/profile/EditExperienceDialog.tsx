/**
 * @file EditExperienceDialog.tsx
 * @description Dialog component for editing experience
 */

'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Experience } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

interface EditExperienceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (index: number, experience: Experience) => Promise<void>;
  experience: Experience | null;
  experienceIndex: number;
}

export function EditExperienceDialog({ isOpen, onClose, onUpdate, experience, experienceIndex }: EditExperienceDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [techStack, setTechStack] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (experience && isOpen) {
      setTitle(experience.title || '');
      setDescription(experience.description || '');
      setDuration(experience.duration || '');
      setTechStack(experience.techStack?.join(', ') || '');
    }
  }, [experience, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !duration.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdate(experienceIndex, {
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim(),
        techStack: techStack
          .split(',')
          .map((tech) => tech.trim())
          .filter((tech) => tech.length > 0),
      });
      onClose();
    } catch (error) {
      console.error('Failed to update experience:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Edit Experience</h2>
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
              {isSubmitting ? 'Updating...' : 'Update Experience'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
