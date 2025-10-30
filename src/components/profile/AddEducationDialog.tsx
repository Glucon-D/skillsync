/**
 * @file AddEducationDialog.tsx
 * @description Dialog component for adding education
 */

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Education } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddEducationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (education: Education) => Promise<void>;
}

export function AddEducationDialog({ isOpen, onClose, onAdd }: AddEducationDialogProps) {
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('');
  const [gpa, setGpa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school.trim() || !degree.trim() || !year.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        school: school.trim(),
        degree: degree.trim(),
        year: year.trim(),
        gpa: gpa.trim() || undefined,
      });
      setSchool('');
      setDegree('');
      setYear('');
      setGpa('');
      onClose();
    } catch (error) {
      console.error('Failed to add education:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Add Education</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="School/University"
            placeholder="e.g., Stanford University"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
          />

          <Input
            label="Degree"
            placeholder="e.g., Bachelor of Science in Computer Science"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            required
          />

          <Input
            label="Year"
            placeholder="e.g., 2020-2024"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />

          <Input
            label="GPA (Optional)"
            placeholder="e.g., 3.8"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
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
              disabled={isSubmitting || !school.trim() || !degree.trim() || !year.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add Education'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
