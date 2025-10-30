/**
 * @file (dashboard)/careers/page.tsx
 * @description Career recommendations page
 * @dependencies react, lucide-react, @/store/careersStore, @/data/careerRoles, @/components/ui
 */

'use client';

import { TrendingUp, DollarSign, Target } from 'lucide-react';
import { useCareersStore } from '@/store/careersStore';
import { careerRoles } from '@/data/careerRoles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CareersPage() {
  const { addCareerGoal, removeCareerGoal, isGoal } = useCareersStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Career Matches</h1>
        <p className="text-text-muted">Explore roles that match your profile</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {careerRoles.map((career) => {
          const isCareerGoal = isGoal(career.id);
          
          return (
            <Card key={career.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{career.title}</CardTitle>
                    <p className="text-text-muted mt-1">{career.description}</p>
                  </div>
                  <Button
                    variant={isCareerGoal ? 'outline' : 'primary'}
                    onClick={() => isCareerGoal ? removeCareerGoal(career.id) : addCareerGoal(career.id)}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    {isCareerGoal ? 'Remove Goal' : 'Set as Goal'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-text-muted">Salary Range</p>
                      <p className="font-semibold text-text">{career.salaryRange}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm text-text-muted">Growth Potential</p>
                      <Badge variant={
                        career.growthPotential === 'high' ? 'success' :
                        career.growthPotential === 'medium' ? 'warning' : 'default'
                      }>
                        {career.growthPotential}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-text mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {career.requiredSkills.map((skill, idx) => (
                      <Badge key={idx} variant="primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
