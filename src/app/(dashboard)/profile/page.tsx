/**
 * @file (dashboard)/profile/page.tsx
 * @description User profile page
 * @dependencies react, lucide-react, @/hooks/useAuth, @/store/profileStore, @/components/ui, @/components/profile
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Edit2, Save, X, Upload, FileText, ExternalLink, Link as LinkIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/profileStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { AddSkillDialog } from "@/components/profile/AddSkillDialog";
import { AddEducationDialog } from "@/components/profile/AddEducationDialog";
import { AddExperienceDialog } from "@/components/profile/AddExperienceDialog";
import { AddProjectDialog } from "@/components/profile/AddProjectDialog";
import { EditProjectDialog } from "@/components/profile/EditProjectDialog";
import { EditEducationDialog } from "@/components/profile/EditEducationDialog";
import { EditExperienceDialog } from "@/components/profile/EditExperienceDialog";

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
    updateEducation,
    updateExperience,
    addProject,
    updateProject,
    addSocialLink,
    addDocument,
    removeSkill,
    removeEducation,
    removeExperience,
    removeProject,
    removeSocialLink,
    removeDocument,
  } = useProfileStore();

  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [editEducationDialogOpen, setEditEducationDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<{ index: number; education: any } | null>(null);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [editExperienceDialogOpen, setEditExperienceDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<{ index: number; experience: any } | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{ index: number; project: any } | null>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [editingSocialLinkIndex, setEditingSocialLinkIndex] = useState<number | null>(null);
  const [editedSocialLink, setEditedSocialLink] = useState("");
  const [bioText, setBioText] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [newSocialLink, setNewSocialLink] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id && !profile && !isLoading) {
      console.log("Profile page: Loading profile for user", user.id);
      loadProfile(user.id);
    }
  }, [user?.id, profile, isLoading, loadProfile]);

  useEffect(() => {
    if (profile) {
      setBioText(profile.bio || "");
      setUsername(profile.username || "");
      setLocation(profile.location || "");
      setWebsiteUrl(profile.websiteUrl || "");
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

  const handleEditBasicInfo = () => {
    setIsEditingBasicInfo(true);
  };

  const handleSaveBasicInfo = async () => {
    await updateProfile({
      username: username.trim() || undefined,
      location: location.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
    });
    setIsEditingBasicInfo(false);
  };

  const handleCancelBasicInfo = () => {
    setUsername(profile?.username || "");
    setLocation(profile?.location || "");
    setWebsiteUrl(profile?.websiteUrl || "");
    setIsEditingBasicInfo(false);
  };

  const handleAddSocialLink = async () => {
    if (newSocialLink.trim()) {
      await addSocialLink(newSocialLink.trim());
      setNewSocialLink("");
    }
  };

  const handleUpdateSocialLink = async (index: number) => {
    if (editedSocialLink.trim() && profile) {
      const updatedLinks = [...(profile.socialLinks || [])];
      updatedLinks[index] = editedSocialLink.trim();
      await updateProfile({ socialLinks: updatedLinks });
      setEditingSocialLinkIndex(null);
      setEditedSocialLink("");
    }
  };

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

      const response = await fetch('/api/profile/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { imageUrl } = await response.json();
      await updateProfile({ userImage: imageUrl });
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
      <div className="flex items-center justify-center h-96 p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          <p className="text-text-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96 p-8">
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

  const getUserInitial = () => {
    if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    }
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-text-muted mt-1">
          Manage your personal information and track your progress
        </p>
      </div>

      {/* Profile Header Card with Avatar and Completion - Full Width */}
      <div className="bg-gradient-to-br from-white via-orange-50/30 to-white dark:from-surface dark:via-primary-900/5 dark:to-surface rounded-3xl shadow-xl shadow-primary-500/5 border border-primary-100 dark:border-primary-900/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Display */}
          <div className="relative group shrink-0">
            {profile.userImage ? (
              <img
                src={profile.userImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-500 shadow-2xl shadow-primary-500/30"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-primary-500/30 relative">
                <div className="absolute inset-0 bg-primary-400 rounded-full blur-xl opacity-30" />
                <span className="relative z-10">{getUserInitial()}</span>
              </div>
            )}
            {/* Upload overlay */}
            <button
              onClick={() => imageInputRef.current?.click()}
              disabled={uploadingImage}
              className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white text-sm font-medium backdrop-blur-sm"
            >
              {uploadingImage ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  <span className="text-xs">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Change Photo</span>
                </div>
              )}
            </button>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploadingImage}
          />

          {/* Profile Info and Completion */}
          <div className="flex-1 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-text">
                  {profile.username ? `@${profile.username}` : user?.name || 'User'}
                </h2>
                {profile.location && (
                  <p className="text-sm text-text-muted flex items-center justify-center sm:justify-start gap-1 mt-1">
                    <span className="text-primary-500">📍</span> {profile.location}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="rounded-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {profile.userImage ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </div>

            {/* Profile Completion */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text">Profile Completion</span>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  profile.completionPercentage === 100 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                }`}>
                  {profile.completionPercentage}%
                </div>
              </div>
              <div className="relative w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-full transition-all duration-700 ease-out shadow-lg relative"
                  style={{ width: `${profile.completionPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid for smaller sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-gradient-to-br from-white via-orange-50/20 to-white dark:from-surface dark:via-primary-900/3 dark:to-surface rounded-2xl shadow-lg shadow-primary-500/5 border border-primary-100 dark:border-primary-900/20 p-6 transition-all hover:shadow-xl hover:shadow-primary-500/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Basic Information</h3>
          {!isEditingBasicInfo ? (
            <Button size="sm" onClick={handleEditBasicInfo} className="rounded-full shadow-md hover:shadow-lg transition-all">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancelBasicInfo} className="rounded-full">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveBasicInfo} className="rounded-full">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
        <div>
          {!isEditingBasicInfo ? (
            <div className="space-y-3">
              {profile.username && (
                <div>
                  <p className="text-sm text-text-muted">Username</p>
                  <p className="text-text font-medium">@{profile.username}</p>
                </div>
              )}
              {profile.location && (
                <div>
                  <p className="text-sm text-text-muted">Location</p>
                  <p className="text-text">{profile.location}</p>
                </div>
              )}
              {profile.websiteUrl && (
                <div>
                  <p className="text-sm text-text-muted">Website</p>
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline flex items-center gap-1"
                  >
                    {profile.websiteUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {!profile.username && !profile.location && !profile.websiteUrl && (
                <div className="text-center py-8 text-text-muted">
                  <p>No basic information added yet</p>
                  <Button className="mt-4" onClick={handleEditBasicInfo}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Add Information
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Username"
                placeholder="e.g., johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                label="Location"
                placeholder="e.g., San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                label="Website URL"
                placeholder="e.g., https://yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
          )}
        </div>
        </div>
        
        {/* Bio */}
        <div className="bg-gradient-to-br from-white via-orange-50/20 to-white dark:from-surface dark:via-primary-900/3 dark:to-surface rounded-2xl shadow-lg shadow-primary-500/5 border border-primary-100 dark:border-primary-900/20 p-6 transition-all hover:shadow-xl hover:shadow-primary-500/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Bio</h3>
          {!isEditingBio ? (
            <Button size="sm" onClick={handleEditBio} className="rounded-full shadow-md hover:shadow-lg transition-all">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancelBio} className="rounded-full">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveBio} className="rounded-full">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
        <div>
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
        </div>
      </div>
      </div>

      <div className="bg-gradient-to-br from-white via-orange-50/20 to-white dark:from-surface dark:via-primary-900/3 dark:to-surface rounded-2xl shadow-lg shadow-primary-500/5 border border-primary-100 dark:border-primary-900/20 p-6 transition-all hover:shadow-xl hover:shadow-primary-500/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Skills</h3>
          <Button size="sm" onClick={() => setSkillDialogOpen(true)} className="rounded-full shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
        {profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {profile.skills.map((skill, index) => (
              <div key={index} className="relative group">
                <div className="px-4 py-2 bg-gradient-to-br from-primary-50 to-orange-50 dark:from-primary-900/30 dark:to-orange-900/20 border border-primary-200 dark:border-primary-800 rounded-full text-sm font-semibold text-primary-700 dark:text-primary-300 pr-10 shadow-sm hover:shadow-md transition-all hover:scale-105 duration-200">
                  {skill.name} <span className="opacity-70">({skill.level})</span>
                </div>
                <button
                  onClick={() => removeSkill(index)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-muted">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-orange-100 dark:from-primary-900/20 dark:to-orange-900/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary-500" />
            </div>
            <p className="font-medium">No skills added yet</p>
            <Button className="mt-4 rounded-full" onClick={() => setSkillDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Skill
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-white via-orange-50/20 to-white dark:from-surface dark:via-primary-900/3 dark:to-surface rounded-2xl shadow-lg shadow-primary-500/5 border border-primary-100 dark:border-primary-900/20 p-6 transition-all hover:shadow-xl hover:shadow-primary-500/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Education</h3>
          <Button size="sm" onClick={() => setEducationDialogOpen(true)} className="rounded-full shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
        <div>
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
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingEducation({ index, education: edu });
                        setEditEducationDialogOpen(true);
                      }}
                      className="p-1 hover:bg-primary-500/20 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-primary-500" />
                    </button>
                    <button
                      onClick={() => removeEducation(index)}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-orange-100 dark:from-primary-900/20 dark:to-orange-900/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary-500" />
              </div>
              <p className="font-medium">No education added yet</p>
              <Button
                className="mt-4 rounded-full"
                onClick={() => setEducationDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Education
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-orange-50/20 to-white dark:from-surface dark:via-primary-900/3 dark:to-surface rounded-2xl shadow-lg shadow-primary-500/5 border border-primary-100 dark:border-primary-900/20 p-6 transition-all hover:shadow-xl hover:shadow-primary-500/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Experience</h3>
          <Button size="sm" onClick={() => setExperienceDialogOpen(true)} className="rounded-full shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
        <div>
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
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingExperience({ index, experience: exp });
                        setEditExperienceDialogOpen(true);
                      }}
                      className="p-1 hover:bg-primary-500/20 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-primary-500" />
                    </button>
                    <button
                      onClick={() => removeExperience(index)}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-orange-100 dark:from-primary-900/20 dark:to-orange-900/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary-500" />
              </div>
              <p className="font-medium">No experience added yet</p>
              <Button
                className="mt-4 rounded-full"
                onClick={() => setExperienceDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Experience
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-orange-50/20 to-white dark:from-surface dark:via-primary-900/3 dark:to-surface rounded-2xl shadow-lg shadow-primary-500/5 border border-primary-100 dark:border-primary-900/20 p-6 transition-all hover:shadow-xl hover:shadow-primary-500/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Projects</h3>
          <Button size="sm" onClick={() => setProjectDialogOpen(true)} className="rounded-full shadow-md hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
        <div>
          {profile.projects && profile.projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {profile.projects.map((project, index) => (
                <div
                  key={index}
                  className="relative group p-4 border border-border rounded-lg hover:border-primary-500 transition-colors"
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-text">{project.name}</h3>
                  <p className="text-sm text-text-muted mt-1">{project.description}</p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-500 hover:underline flex items-center gap-1 mt-2"
                    >
                      View Project
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.techStack.map((tech, i) => (
                      <Badge key={i} variant="default" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingProject({ index, project });
                        setEditProjectDialogOpen(true);
                      }}
                      className="p-1 hover:bg-primary-500/20 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-primary-500" />
                    </button>
                    <button
                      onClick={() => removeProject(index)}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-orange-100 dark:from-primary-900/20 dark:to-orange-900/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary-500" />
              </div>
              <p className="font-medium">No projects added yet</p>
              <Button className="mt-4 rounded-full" onClick={() => setProjectDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-orange-50/20 to-white dark:from-surface dark:via-primary-900/3 dark:to-surface rounded-2xl shadow-lg shadow-primary-500/5 border border-primary-100 dark:border-primary-900/20 p-6 transition-all hover:shadow-xl hover:shadow-primary-500/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Social Links</h3>
        </div>
        <div>
          <div className="space-y-4">
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="space-y-2">
                {profile.socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="relative group flex items-center justify-between p-3 bg-surface rounded-lg border border-border hover:border-primary-500 transition-colors"
                  >
                    {editingSocialLinkIndex === index ? (
                      <>
                        <Input
                          value={editedSocialLink}
                          onChange={(e) => setEditedSocialLink(e.target.value)}
                          className="flex-1 mr-2"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateSocialLink(index);
                            } else if (e.key === 'Escape') {
                              setEditingSocialLinkIndex(null);
                              setEditedSocialLink("");
                            }
                          }}
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateSocialLink(index)}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingSocialLinkIndex(null);
                              setEditedSocialLink("");
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-500 hover:underline flex items-center gap-2 flex-1 truncate"
                        >
                          <LinkIcon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{link}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={() => {
                              setEditingSocialLinkIndex(index);
                              setEditedSocialLink(link);
                            }}
                            className="p-1 hover:bg-primary-500/20 rounded"
                          >
                            <Edit2 className="w-4 h-4 text-primary-500" />
                          </button>
                          <button
                            onClick={() => removeSocialLink(index)}
                            className="p-1 hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Add social media link (e.g., https://github.com/username)"
                value={newSocialLink}
                onChange={(e) => setNewSocialLink(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSocialLink();
                  }
                }}
              />
              <Button onClick={handleAddSocialLink} disabled={!newSocialLink.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-orange-50/20 to-white dark:from-surface dark:via-primary-900/3 dark:to-surface rounded-2xl shadow-lg shadow-primary-500/5 border border-primary-100 dark:border-primary-900/20 p-6 transition-all hover:shadow-xl hover:shadow-primary-500/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Documents</h3>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        <div>
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
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
        </div>
      </div>

      {/* Dialog Components */}
      {skillDialogOpen && <AddSkillDialog
        isOpen={skillDialogOpen}
        onClose={() => setSkillDialogOpen(false)}
        onAdd={addSkill}
      />}
      {educationDialogOpen && <AddEducationDialog
        isOpen={educationDialogOpen}
        onClose={() => setEducationDialogOpen(false)}
        onAdd={addEducation}
      />}
      {experienceDialogOpen && <AddExperienceDialog
        isOpen={experienceDialogOpen}
        onClose={() => setExperienceDialogOpen(false)}
        onAdd={addExperience}
      />}
      {projectDialogOpen && <AddProjectDialog
        isOpen={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        onAdd={addProject}
      />}
      {editProjectDialogOpen && <EditProjectDialog
        isOpen={editProjectDialogOpen}
        onClose={() => {
          setEditProjectDialogOpen(false);
          setEditingProject(null);
        }}
        onUpdate={updateProject}
        project={editingProject?.project || null}
        projectIndex={editingProject?.index || 0}
      />}
      {editEducationDialogOpen && <EditEducationDialog
        isOpen={editEducationDialogOpen}
        onClose={() => {
          setEditEducationDialogOpen(false);
          setEditingEducation(null);
        }}
        onUpdate={updateEducation}
        education={editingEducation?.education || null}
        educationIndex={editingEducation?.index || 0}
      />}
      {editExperienceDialogOpen && <EditExperienceDialog
        isOpen={editExperienceDialogOpen}
        onClose={() => {
          setEditExperienceDialogOpen(false);
          setEditingExperience(null);
        }}
        onUpdate={updateExperience}
        experience={editingExperience?.experience || null}
        experienceIndex={editingExperience?.index || 0}
      />}
    </div>
  );
}

