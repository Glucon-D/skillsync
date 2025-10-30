/**
 * @file (dashboard)/profile/page.tsx
 * @description User profile page
 * @dependencies react, lucide-react, @/hooks/useAuth, @/store/profileStore, @/components/ui, @/components/profile
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Edit2, Save, X, Upload, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/profileStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { AddSkillDialog } from "@/components/profile/AddSkillDialog";
import { AddEducationDialog } from "@/components/profile/AddEducationDialog";
import { AddExperienceDialog } from "@/components/profile/AddExperienceDialog";

export default function ProfilePage() {
  const { user } = useAuth();
  const {
    profile,
    loadProfile,
    isLoading,
    updateProfile,
    addSkill,
    addEducation,
    addExperience,
    addDocument,
    removeSkill,
    removeEducation,
    removeExperience,
    removeDocument,
  } = useProfileStore();

  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id && !profile && !isLoading) {
      console.log("Profile page: Loading profile for user", user.id);
      loadProfile(user.id);
    }
  }, [user?.id, profile, isLoading, loadProfile]);

  useEffect(() => {
    if (profile) {
      setBioText(profile.bio || "");
    }
  }, [profile]);

  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  const handleSaveBio = async () => {
    await updateProfile({ bio: bioText });
    setIsEditingBio(false);
  };

  const handleCancelBio = () => {
    setBioText(profile?.bio || "");
    setIsEditingBio(false);
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user?.id) return;

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const { document } = await response.json();
        await addDocument(document);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          <p className="text-text-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-text mb-4">Unable to load profile</p>
            <Button onClick={() => user?.id && loadProfile(user.id)}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">My Profile</h1>
        <p className="text-text-muted">
          Manage your personal information and track your progress
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile Completion</CardTitle>
            <Badge
              variant={
                profile.completionPercentage === 100 ? "success" : "warning"
              }
            >
              {profile.completionPercentage}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-background rounded-full h-3">
            <div
              className="bg-primary-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${profile.completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bio</CardTitle>
            {!isEditingBio ? (
              <Button size="sm" onClick={handleEditBio}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCancelBio}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveBio}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isEditingBio ? (
            <div className="text-text">
              {profile.bio ? (
                <p className="whitespace-pre-wrap">{profile.bio}</p>
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <p>No bio added yet</p>
                  <Button className="mt-4" onClick={handleEditBio}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Add Bio
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              placeholder="Write a brief introduction about yourself..."
              rows={6}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Skills</CardTitle>
            <Button size="sm" onClick={() => setSkillDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <div key={index} className="relative group">
                  <Badge variant="primary" className="pr-8">
                    {skill.name} ({skill.level})
                  </Badge>
                  <button
                    onClick={() => removeSkill(index)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p>No skills added yet</p>
              <Button className="mt-4" onClick={() => setSkillDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddSkillDialog
        isOpen={skillDialogOpen}
        onClose={() => setSkillDialogOpen(false)}
        onAdd={addSkill}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button size="sm" onClick={() => setEducationDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {profile.education.length > 0 ? (
            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <div
                  key={index}
                  className="relative group border-l-2 border-primary-500 pl-4 pr-8"
                >
                  <h3 className="font-semibold text-text">{edu.degree}</h3>
                  <p className="text-text-muted">{edu.school}</p>
                  <p className="text-sm text-text-muted">{edu.year}</p>
                  {edu.gpa && (
                    <p className="text-sm text-text-muted">GPA: {edu.gpa}</p>
                  )}
                  <button
                    onClick={() => removeEducation(index)}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p>No education added yet</p>
              <Button
                className="mt-4"
                onClick={() => setEducationDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddEducationDialog
        isOpen={educationDialogOpen}
        onClose={() => setEducationDialogOpen(false)}
        onAdd={addEducation}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Experience</CardTitle>
            <Button size="sm" onClick={() => setExperienceDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {profile.experience.length > 0 ? (
            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={index} className="relative group space-y-2 pr-8">
                  <h3 className="font-semibold text-text">{exp.title}</h3>
                  <p className="text-text-muted text-sm">{exp.duration}</p>
                  <p className="text-text">{exp.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.techStack.map((tech, i) => (
                      <Badge key={i} variant="default" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <button
                    onClick={() => removeExperience(index)}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p>No experience added yet</p>
              <Button
                className="mt-4"
                onClick={() => setExperienceDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          {profile.documents && profile.documents.length > 0 ? (
            <div className="space-y-4">
              {profile.documents.map((doc, index) => (
                <div
                  key={doc.id || index}
                  className="relative group p-4 bg-surface rounded-lg border border-border hover:border-primary-500 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-text hover:text-primary-500 transition-colors block truncate"
                        >
                          {doc.name}
                        </a>
                        {doc.uploadedAt && (
                          <p className="text-xs text-text-muted mt-1">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                        {doc.summary && (
                          <p className="text-sm text-text-muted mt-2 line-clamp-2">
                            {doc.summary}
                          </p>
                        )}
                        {doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(doc.extractedData).map(([key, value]) => {
                              if (Array.isArray(value) && value.length > 0) {
                                return (
                                  <Badge key={key} variant="default" size="sm">
                                    {key}: {value.length}
                                  </Badge>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        try {
                          await fetch(`/api/documents/${doc.id}`, {
                            method: 'DELETE',
                          });
                        } catch (error) {
                          console.error('Delete error:', error);
                        }
                        await removeDocument(index);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted">
              <FileText className="w-12 h-12 mx-auto mb-4 text-text-muted" />
              <p>No documents uploaded yet</p>
              <p className="text-sm mt-2">
                Upload your resume, certificates, or other relevant documents
              </p>
              <Button
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddSkillDialog
        isOpen={skillDialogOpen}
        onClose={() => setSkillDialogOpen(false)}
        onAdd={addSkill}
      />
      <AddEducationDialog
        isOpen={educationDialogOpen}
        onClose={() => setEducationDialogOpen(false)}
        onAdd={addEducation}
      />
      <AddExperienceDialog
        isOpen={experienceDialogOpen}
        onClose={() => setExperienceDialogOpen(false)}
        onAdd={addExperience}
      />
    </div>
  );
}
