/**
 * @file AddProjectDialog.tsx
 * @description Dialog component for adding projects
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const WELL_KNOWN_TECHNOLOGIES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "NestJS",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "ASP.NET",
  "Laravel",
  "Ruby on Rails",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "SQLite",
  "Firebase",
  "Supabase",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Vercel",
  "Netlify",
  "Heroku",
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "CI/CD",
  "Jenkins",
  "GitHub Actions",
  "TailwindCSS",
  "Bootstrap",
  "Material-UI",
  "Chakra UI",
  "Sass",
  "CSS",
  "HTML",
  "GraphQL",
  "REST API",
  "WebSocket",
  "gRPC",
  "Microservices",
  "Serverless",
  "Jest",
  "Vitest",
  "Cypress",
  "Playwright",
  "Testing Library",
  "Mocha",
  "Chai",
  "Webpack",
  "Vite",
  "Rollup",
  "Babel",
  "ESLint",
  "Prettier",
  "TypeORM",
  "Prisma",
];

interface AddProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: Project) => Promise<void>;
}

export function AddProjectDialog({
  isOpen,
  onClose,
  onAdd,
}: AddProjectDialogProps) {
  const { user } = useAuth();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const techInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [techInputValue, setTechInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (techInputValue.trim()) {
      const filtered = WELL_KNOWN_TECHNOLOGIES.filter(
        (tech) =>
          tech.toLowerCase().includes(techInputValue.toLowerCase()) &&
          !selectedTech.includes(tech)
      ).slice(0, 5);
      setFilteredSuggestions(filtered);
      setActiveSuggestionIndex(-1);
    } else {
      setFilteredSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  }, [techInputValue, selectedTech]);

  const addTech = (tech: string) => {
    const trimmedTech = tech.trim();
    if (trimmedTech && !selectedTech.includes(trimmedTech)) {
      setSelectedTech([...selectedTech, trimmedTech]);
      setTechInputValue("");
      setFilteredSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  };

  const removeTech = (techToRemove: string) => {
    setSelectedTech(selectedTech.filter((tech) => tech !== techToRemove));
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        activeSuggestionIndex >= 0 &&
        filteredSuggestions[activeSuggestionIndex]
      ) {
        addTech(filteredSuggestions[activeSuggestionIndex]);
      } else if (techInputValue.trim()) {
        addTech(techInputValue);
      }
    } else if (e.key === " ") {
      if (techInputValue.trim()) {
        e.preventDefault();
        addTech(techInputValue);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        const newIndex = Math.min(
          activeSuggestionIndex + 1,
          filteredSuggestions.length - 1
        );
        setActiveSuggestionIndex(newIndex);
        setTechInputValue(filteredSuggestions[newIndex]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeSuggestionIndex > 0) {
        const newIndex = activeSuggestionIndex - 1;
        setActiveSuggestionIndex(newIndex);
        setTechInputValue(filteredSuggestions[newIndex]);
      } else if (activeSuggestionIndex === 0) {
        setActiveSuggestionIndex(-1);
        setTechInputValue("");
      }
    } else if (e.key === "Escape") {
      setFilteredSuggestions([]);
      setActiveSuggestionIndex(-1);
    } else if (
      e.key === "Backspace" &&
      !techInputValue &&
      selectedTech.length > 0
    ) {
      removeTech(selectedTech[selectedTech.length - 1]);
    } else if (e.key === "Tab" && activeSuggestionIndex >= 0) {
      e.preventDefault();
      addTech(filteredSuggestions[activeSuggestionIndex]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const response = await fetch("/api/project/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { imageUrl } = await response.json();
      setImage(imageUrl);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        description: description.trim(),
        url: url.trim() || undefined,
        techStack: selectedTech,
        image: image.trim() || undefined,
      });
      setName("");
      setDescription("");
      setUrl("");
      setSelectedTech([]);
      setTechInputValue("");
      setImage("");
      onClose();
    } catch (error) {
      console.error("Failed to add project:", error);
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
            <label className="block text-sm font-medium text-text mb-1.5">
              Tech Stack
            </label>
            <div className="relative">
              <div className="min-h-[42px] w-full px-3 py-2 bg-background border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all flex flex-wrap gap-2 items-center">
                {selectedTech.map((tech, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1.5 bg-primary-500 text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  ref={techInputRef}
                  type="text"
                  value={techInputValue}
                  onChange={(e) => setTechInputValue(e.target.value)}
                  onKeyDown={handleTechKeyDown}
                  placeholder={
                    selectedTech.length === 0
                      ? "Type to search technologies..."
                      : ""
                  }
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-text placeholder:text-text-muted"
                />
              </div>

              {filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addTech(suggestion)}
                      className={`w-full px-3 py-2 text-left hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors ${
                        index === activeSuggestionIndex
                          ? "bg-primary-50 dark:bg-primary-900/20"
                          : ""
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-text-muted mt-1">
              Type and press Space or Enter to add. Use arrow keys to navigate
              suggestions.
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
                  onClick={() => setImage("")}
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
              {isSubmitting ? "Adding..." : "Add Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
