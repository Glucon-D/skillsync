/**
 * @file onboarding/page.tsx
 * @description Onboarding wizard page
 * @dependencies react, next/navigation, lucide-react, @/hooks/useAuth, @/store/profileStore, @/lib/constants, @/components/ui
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfileStore } from '@/store/profileStore';
import { ROUTES } from '@/lib/constants';
import type { Profile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { setProfile } = useProfileStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    phone: '',
  });

  const handleComplete = () => {
    if (user) {
      const profile: Profile = {
        userId: user.id,
        bio: formData.bio,
        phone: formData.phone,
        education: [],
        skills: [],
        experience: [],
        completionPercentage: 25,
      };
      setProfile(profile);
      router.push(ROUTES.DASHBOARD);
    }
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <div className="text-center mb-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <CardTitle className="text-2xl">Welcome to SkillSync!</CardTitle>
              <p className="text-text-muted mt-2">Let&apos;s set up your profile</p>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-text-muted text-center mt-2">
              Step {step} of {totalSteps}
            </p>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text">Tell us about yourself</h3>
                <Textarea
                  label="Bio"
                  placeholder="Write a brief introduction about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
                <Input
                  label="Phone (Optional)"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold text-text">Basic Info Complete!</h3>
                <p className="text-text-muted">
                  You can add more details like education, skills, and experience later from your profile page.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-center">
                <CheckCircle className="w-16 h-16 text-primary-500 mx-auto" />
                <h3 className="text-lg font-semibold text-text">You&apos;re All Set!</h3>
                <p className="text-text-muted">
                  Take the assessment quiz to get personalized career recommendations.
                </p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                Back
              </Button>
              {step < totalSteps ? (
                <Button onClick={() => setStep(step + 1)}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleComplete}>
                  Go to Dashboard
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
