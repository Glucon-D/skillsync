/**
 * @file (dashboard)/profile/page.tsx
 * @description User profile page
 * @dependencies react, lucide-react, @/hooks/useAuth, @/store/profileStore, @/components/ui
 */

'use client';

import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfileStore } from '@/store/profileStore';
import type { Profile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, setProfile } = useProfileStore();

  useEffect(() => {
    if (!profile && user) {
      const initialProfile: Profile = {
        userId: user.id,
        bio: '',
        education: [],
        skills: [],
        experience: [],
        completionPercentage: 0,
      };
      setProfile(initialProfile);
    }
  }, [profile, user, setProfile]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">My Profile</h1>
        <p className="text-text-muted">Manage your personal information and track your progress</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile Completion</CardTitle>
            <Badge variant={profile.completionPercentage === 100 ? 'success' : 'warning'}>
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
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="primary">
                  {skill.name} ({skill.level})
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p>No skills added yet</p>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.education.length > 0 ? (
            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary-500 pl-4">
                  <h3 className="font-semibold text-text">{edu.degree}</h3>
                  <p className="text-text-muted">{edu.school}</p>
                  <p className="text-sm text-text-muted">{edu.year}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p>No education added yet</p>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.experience.length > 0 ? (
            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={index} className="space-y-2">
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p>No experience added yet</p>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
