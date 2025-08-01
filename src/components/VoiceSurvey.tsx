import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Volume2, CheckCircle } from 'lucide-react';

interface SurveyResponse {
  question: string;
  answer: string;
  analysis: string;
}

const VoiceSurvey = ({ onComplete }: { onComplete: (responses: SurveyResponse[]) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const questions = [
    "What time do you usually go to bed and wake up?",
    "How would you describe your cleanliness level and expectations?",
    "Do you prefer a quiet environment or are you okay with some background noise?",
    "How often do you have friends or guests over?",
    "What's most important to you in a roommate relationship?"
  ];

  const mockResponses = [
    "I usually sleep by 11 PM and wake up at 7 AM on weekdays",
    "I'm very clean and organized, I like things tidy",
    "I prefer a quiet environment, especially during work hours",
    "I occasionally have friends over on weekends, maybe twice a month",
    "Trust and respect for personal space are most important to me"
  ];

  const mockAnalysis = [
    "Sleep schedule: Early bird (11 PM - 7 AM)",
    "Cleanliness: High standards, organized lifestyle",
    "Noise preference: Quiet, values peaceful environment",
    "Social habits: Moderate social activity, weekend gatherings",
    "Values: Privacy-focused, relationship boundaries"
  ];

  const handleVoiceToggle = () => {
    if (isListening) {
      // Simulate voice processing
      setTimeout(() => {
        setCurrentAnswer(mockResponses[currentQuestion]);
        setIsListening(false);
      }, 2000);
    } else {
      setIsListening(true);
    }
  };

  const handleNextQuestion = () => {
    const newResponse = {
      question: questions[currentQuestion],
      answer: currentAnswer || mockResponses[currentQuestion],
      analysis: mockAnalysis[currentQuestion]
    };
    
    setResponses([...responses, newResponse]);
    setCurrentAnswer('');
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete([...responses, newResponse]);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-floating">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Voice-Powered Compatibility Survey
          </CardTitle>
          <Progress value={progress} className="w-full mt-4" />
          <p className="text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-gradient-card p-6 rounded-lg shadow-gentle">
              <Volume2 className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {questions[currentQuestion]}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Button
              variant={isListening ? "voice" : "hero"}
              size="xl"
              onClick={handleVoiceToggle}
              className="w-32 h-32 rounded-full"
            >
              {isListening ? (
                <MicOff className="w-12 h-12" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              {isListening ? "Listening... Speak naturally" : "Tap to start speaking"}
            </p>
          </div>

          {currentAnswer && (
            <div className="bg-accent/20 p-4 rounded-lg border border-accent/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="font-medium text-accent-foreground">Your Response:</span>
              </div>
              <p className="text-foreground">{currentAnswer}</p>
            </div>
          )}

          <div className="flex justify-center">
            <Button 
              onClick={handleNextQuestion}
              variant="gradient"
              size="lg"
              disabled={!currentAnswer && !isListening}
            >
              {currentQuestion === questions.length - 1 ? 'Complete Survey' : 'Next Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceSurvey;