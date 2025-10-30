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
  const { currentQuestion, result, isCompleted, setAnswer, nextQuestion, previousQuestion, calculateResults, resetAssessment } = useAssessmentStore();
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
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <p className="text-text-muted">Your dominant type: <strong>{result.dominantType}</strong></p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(result.scores).map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize text-text">{category}</span>
                    <span className="text-text-muted">{score.toFixed(1)}/5</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={resetAssessment} variant="outline" className="w-full">Retake Assessment</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text">Career Assessment</h1>
        <p className="text-text-muted">Answer questions to discover your career strengths</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge>Question {currentQuestion + 1} of {quizQuestions.length}</Badge>
            <span className="text-sm text-text-muted">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-background rounded-full h-2 mb-4">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <CardTitle>{currentQ?.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {currentQ?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-border hover:border-primary-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleAnswer}
              disabled={selectedAnswer === null}
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
