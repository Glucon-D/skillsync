/**
 * @file (dashboard)/pathways/page.tsx
 * @description Skill pathways page
 * @dependencies react, lucide-react, @/store/pathwaysStore, @/store/authStore, @/data/skills, @/components/ui
 */

'use client';

import { useEffect } from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { usePathwaysStore } from '@/store/pathwaysStore';
import { useAuthStore } from '@/store/authStore';
import { skillsPathways } from '@/data/skills';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PathwaysPage() {
  const user = useAuthStore((state) => state.user);
  const { userPathways, togglePathwayCompletion, isPathwayCompleted, getProgress, loadPathways } = usePathwaysStore();

  useEffect(() => {
    if (user?.id) {
      loadPathways(user.id);
    }
  }, [user?.id, loadPathways]);

  const progress = getProgress(skillsPathways.length);
  const completedCount = userPathways.filter(p => p.completed).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Learning Pathways</h1>
        <p className="text-text-muted">Track your progress on recommended skills</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-text">{progress}%</span>
            <span className="text-text-muted">{completedCount} / {skillsPathways.length} completed</span>
          </div>
          <div className="w-full bg-background rounded-full h-3">
            <div
              className="bg-primary-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillsPathways.map((pathway) => {
          const isCompleted = isPathwayCompleted(pathway.id);

          return (
            <Card key={pathway.id} className={isCompleted ? 'border-green-500' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{pathway.name}</CardTitle>
                    <p className="text-sm text-text-muted mt-1">{pathway.category}</p>
                  </div>
                  <button
                    onClick={() => user?.id && togglePathwayCompletion(user.id, pathway)}
                    className="flex-shrink-0"
                    disabled={!user?.id}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-text-muted" />
                    )}
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={pathway.level === 'beginner' ? 'default' : pathway.level === 'intermediate' ? 'warning' : 'error'}>
                    {pathway.level}
                  </Badge>
                  <div className="flex items-center text-sm text-text-muted">
                    <Clock className="w-4 h-4 mr-1" />
                    {pathway.estimatedTime}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-text mb-1">Resources:</p>
                  <div className="flex flex-wrap gap-1">
                    {pathway.resources.map((resource, idx) => (
                      <Badge key={idx} variant="default" size="sm">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant={isCompleted ? 'outline' : 'primary'}
                  size="sm"
                  className="w-full"
                  onClick={() => user?.id && togglePathwayCompletion(user.id, pathway)}
                  disabled={!user?.id}
                >
                  {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
