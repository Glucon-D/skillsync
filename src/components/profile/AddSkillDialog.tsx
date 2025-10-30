/**
 * @file AddSkillDialog.tsx
 * @description Dialog component for adding a new skill
 */

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Skill, SkillLevel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';

interface AddSkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (skill: Skill) => Promise<void>;
}

export function AddSkillDialog({ isOpen, onClose, onAdd }: AddSkillDialogProps) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<SkillLevel>('beginner');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({ name: name.trim(), level });
      setName('');
      setLevel('beginner');
      onClose();
    } catch (error) {
      console.error('Failed to add skill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Add New Skill</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Skill Name"
            placeholder="e.g., React, Python, Data Analysis"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Select
            label="Proficiency Level"
            value={level}
            onChange={(e) => setLevel(e.target.value as SkillLevel)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>

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
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
