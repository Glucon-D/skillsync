/**
 * @file (dashboard)/assessment/page.tsx
 * @description Assessment quiz page
 * @dependencies react, lucide-react, @/hooks/useAuth, @/store/assessmentStore, @/data/quizQuestions, @/components/ui
 */

'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAssessmentStore } from '@/store/assessmentStore';
import { quizQuestions } from '@/data/quizQuestions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AssessmentPage() {
  const { user } = useAuth();
  const { currentQuestion, result, isCompleted, isSaving, saveError, setAnswer, nextQuestion, previousQuestion, calculateResults, resetAssessment } = useAssessmentStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = () => {
    if (selectedAnswer !== null && currentQ) {
      setAnswer(currentQ.id, selectedAnswer + 1, currentQ.category);
      setSelectedAnswer(null);
      
      if (currentQuestion < quizQuestions.length - 1) {
        nextQuestion();
      } else if (user) {
        calculateResults(user.id);
      }
    }
  };

  if (isCompleted && result) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-2xl mx-auto animate-[fadeIn_0.6s_ease-out]">
          <div className="bg-gradient-to-br from-white via-orange-50/30 to-white dark:from-surface dark:via-primary-900/5 dark:to-surface rounded-3xl shadow-2xl shadow-primary-500/10 border border-primary-100 dark:border-primary-900/20 p-5 sm:p-6 space-y-4">
            
            {/* Success Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-40 animate-pulse" />
                <CheckCircle className="w-7 h-7 text-white relative z-10" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 bg-clip-text text-transparent">
                Assessment Complete!
              </h2>

              {/* Status Messages */}
              <div className="flex justify-center">
                {isSaving && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 shadow-md">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 dark:border-blue-400" />
                    <span>Saving...</span>
                  </div>
                )}

                {!isSaving && !saveError && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800 shadow-md">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Saved Successfully</span>
                  </div>
                )}

                {saveError && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-800 shadow-md">
                    <span>❌ Failed to save</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dominant Type Badge */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-2xl shadow-xl">
                  <div className="text-xs uppercase tracking-widest font-semibold opacity-90 mb-0.5">
                    Your Dominant Type
                  </div>
                  <div className="text-xl sm:text-2xl font-bold capitalize">
                    {result.dominantType}
                  </div>
                </div>
              </div>
            </div>

            {/* Scores Section */}
            <div className="space-y-2.5 pt-1">
              <h3 className="text-base font-semibold text-text text-center mb-2">Your Scores</h3>
              <div className="space-y-2.5">
                {Object.entries(result.scores).map(([category, score], index) => (
                  <div 
                    key={category} 
                    className="space-y-1"
                    style={{ 
                      animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex justify-between items-baseline">
                      <span className="capitalize text-text font-semibold text-sm">{category}</span>
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">{score.toFixed(1)}/5</span>
                    </div>
                    <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-full transition-all duration-1000 ease-out shadow-lg relative"
                        style={{ width: `${(score / 5) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                onClick={resetAssessment}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 rounded-full shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-2 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
          Career Assessment
        </h1>
        <p className="text-xs text-text-muted">
          Answer questions to discover your career strengths
        </p>
      </div>

      <Card className="shadow-xl shadow-primary-500/5 border-primary-500/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <Badge className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0 shadow-lg shadow-primary-500/30">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </Badge>
            <span className="text-xs font-medium text-text-muted">{Math.round(progress)}% Complete</span>
          </div>
          
          <div className="relative w-full h-1.5 bg-background rounded-full mb-2 overflow-hidden shadow-inner">
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-primary-500/50"
              style={{ 
                width: `${progress}%`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite linear'
              }}
            />
          </div>
          
          <CardTitle className="text-base sm:text-lg leading-tight">{currentQ?.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="space-y-1.5">
            {currentQ?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`group relative w-full p-2.5 text-left rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswer === index
                    ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/30 dark:to-primary-900/10 shadow-lg shadow-primary-500/20 scale-[1.01]'
                    : 'border-border hover:border-primary-300 hover:shadow-md hover:scale-[1.005] bg-surface hover:bg-background'
                }`}
              >
                <span className={`text-xs sm:text-sm transition-colors pr-7 ${
                  selectedAnswer === index ? 'text-primary-700 dark:text-primary-300 font-medium' : 'text-text'
                }`}>
                  {option}
                </span>
                {selectedAnswer === index && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <CheckCircle className="w-4 h-4 text-primary-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-3 gap-2">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              size="sm"
              className="min-w-[90px]"
            >
              Previous
            </Button>
            <Button
              onClick={handleAnswer}
              disabled={selectedAnswer === null}
              size="sm"
              className="min-w-[90px] shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
