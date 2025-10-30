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
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-3 sm:p-6">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="border-2 shadow-2xl overflow-hidden">
            <CardContent className="p-4 sm:p-6 space-y-4">

              {/* Success Header */}
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 animate-pulse" />
                  <CheckCircle className="w-8 h-8 text-white relative z-10" strokeWidth={2.5} />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
                  Assessment Complete!
                </h2>

                {/* Status Messages */}
                <div className="flex justify-center">
                  {isSaving && (
                    <Badge className="inline-flex items-center gap-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 px-3 py-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-700 dark:border-blue-300 border-t-transparent" />
                      <span>Saving...</span>
                    </Badge>
                  )}

                  {!isSaving && !saveError && (
                    <Badge className="inline-flex items-center gap-1.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 px-3 py-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Saved Successfully</span>
                    </Badge>
                  )}

                  {saveError && (
                    <Badge className="inline-flex items-center gap-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 px-3 py-1">
                      <span>Failed to save</span>
                    </Badge>
                  )}
                </div>
              </div>

              {/* Dominant Type Badge */}
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl shadow-xl border border-primary-400">
                    <div className="text-xs uppercase tracking-widest font-bold opacity-90">
                      Your Dominant Type
                    </div>
                    <div className="text-2xl font-bold capitalize">
                      {result.dominantType}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scores Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text text-center">Your Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(result.scores).map(([category, score], index) => (
                    <div
                      key={category}
                      className="space-y-1.5 p-3 bg-surface rounded-lg border border-border hover:border-primary-400 transition-all duration-300"
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="capitalize text-text font-bold text-sm">{category}</span>
                        <span className="text-primary-600 dark:text-primary-400 font-bold text-base">{score.toFixed(1)}/5</span>
                      </div>
                      <div className="relative h-2 bg-background rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000 ease-out shadow-lg relative"
                          style={{
                            width: `${(score / 5) * 100}%`,
                            animation: `slideIn 0.8s ease-out ${index * 0.15}s both`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-[shimmer_2s_infinite]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  onClick={resetAssessment}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 text-base rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Retake Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
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
