/**
 * @file EditEducationDialog.tsx
 * @description Dialog component for editing education
 */

'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Education } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditEducationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (index: number, education: Education) => Promise<void>;
  education: Education | null;
  educationIndex: number;
}

export function EditEducationDialog({ isOpen, onClose, onUpdate, education, educationIndex }: EditEducationDialogProps) {
  const [school, setSchool] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('');
  const [gpa, setGpa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (education && isOpen) {
      setSchool(education.school || '');
      setDegree(education.degree || '');
      setYear(education.year || '');
      setGpa(education.gpa || '');
    }
  }, [education, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school.trim() || !degree.trim() || !year.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdate(educationIndex, {
        school: school.trim(),
        degree: degree.trim(),
        year: year.trim(),
        gpa: gpa.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update education:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Edit Education</h2>
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
              {isSubmitting ? 'Updating...' : 'Update Education'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
