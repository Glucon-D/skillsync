/**
 * @file AddSkillDialog.tsx
 * @description Dialog component for adding multiple skills with autocomplete
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import type { Skill, SkillLevel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";

interface AddSkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (skill: Skill) => Promise<void>;
}

const WELL_KNOWN_SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "PHP",
  "HTML",
  "CSS",
  "React",
  "Angular",
  "Vue.js",
  "Next.js",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "ASP.NET",
  "Laravel",
  "Ruby on Rails",
  "FastAPI",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "SQLite",
  "Oracle",
  "SQL Server",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "Git",
  "GitHub",
  "GitLab",
  "Machine Learning",
  "Deep Learning",
  "Data Analysis",
  "Data Science",
  "AI",
  "NLP",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "REST API",
  "GraphQL",
  "Microservices",
  "Agile",
  "Scrum",
  "DevOps",
  "CI/CD",
  "Testing",
  "Jest",
  "Pytest",
  "Selenium",
  "Cypress",
  "UI/UX Design",
  "Figma",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Team Collaboration",
  "Project Management",
];

export function AddSkillDialog({
  isOpen,
  onClose,
  onAdd,
}: AddSkillDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [level, setLevel] = useState<SkillLevel>("beginner");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = WELL_KNOWN_SKILLS.filter(
        (skill) =>
          skill.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
          !selectedSkills.includes(skill)
      ).slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
    setActiveSuggestionIndex(-1);
  }, [inputValue, selectedSkills]);

  const addSkill = (skillName: string) => {
    const trimmedSkill = skillName.trim();
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      setSelectedSkills([...selectedSkills, trimmedSkill]);
    }
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.endsWith(" ") && value.trim()) {
      addSkill(value);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        activeSuggestionIndex >= 0 &&
        filteredSuggestions[activeSuggestionIndex]
      ) {
        addSkill(filteredSuggestions[activeSuggestionIndex]);
      } else if (inputValue.trim()) {
        addSkill(inputValue);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showSuggestions && filteredSuggestions.length > 0) {
        const newIndex =
          activeSuggestionIndex < filteredSuggestions.length - 1
            ? activeSuggestionIndex + 1
            : activeSuggestionIndex;
        setActiveSuggestionIndex(newIndex);
        setInputValue(filteredSuggestions[newIndex]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showSuggestions && activeSuggestionIndex > 0) {
        const newIndex = activeSuggestionIndex - 1;
        setActiveSuggestionIndex(newIndex);
        setInputValue(filteredSuggestions[newIndex]);
      } else if (activeSuggestionIndex === 0) {
        setActiveSuggestionIndex(-1);
        setInputValue("");
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    } else if (e.key === "Tab" && activeSuggestionIndex >= 0) {
      e.preventDefault();
      addSkill(filteredSuggestions[activeSuggestionIndex]);
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      selectedSkills.length > 0
    ) {
      removeSkill(selectedSkills[selectedSkills.length - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) return;

    setIsSubmitting(true);
    try {
      for (const skillName of selectedSkills) {
        await onAdd({ name: skillName, level });
      }
      setSelectedSkills([]);
      setInputValue("");
      setLevel("beginner");
      onClose();
    } catch (error) {
      console.error("Failed to add skills:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Add New Skills</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-text mb-1">
              Skill Names
            </label>
            <div className="border border-border rounded-lg p-2 bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 bg-primary-500 text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedSkills.length === 0
                    ? "Type skills (space to add multiple)"
                    : "Add more..."
                }
                className="w-full bg-transparent outline-none text-text placeholder:text-text-muted"
              />
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addSkill(suggestion)}
                    className={`w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors ${
                      index === activeSuggestionIndex ? "bg-primary/10" : ""
                    }`}
                  >
                    <span className="text-text">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-text-muted mt-1">
              Press space or Enter to add a skill. Use arrow keys to navigate
              suggestions.
            </p>
          </div>

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
              disabled={isSubmitting || selectedSkills.length === 0}
            >
              {isSubmitting
                ? "Adding..."
                : `Add ${selectedSkills.length} Skill${
                    selectedSkills.length !== 1 ? "s" : ""
                  }`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
