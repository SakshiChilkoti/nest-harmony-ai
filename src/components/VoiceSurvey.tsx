import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Volume2, CheckCircle, Settings, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OmniDimensionClient from '@/lib/omnidimension';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SurveyResponse {
  question: string;
  answer: string;
  analysis: string;
  audioBlob?: Blob;
}

interface OmniDimConfig {
  apiKey: string;
  agentId?: string;
}

const VoiceSurvey = ({ onComplete }: { onComplete: (responses: SurveyResponse[]) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [omniDimConfig, setOmniDimConfig] = useState<OmniDimConfig>({ apiKey: '' });
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  
  const { toast } = useToast();

  const questions = [
    "What time do you usually go to bed and wake up?",
    "How would you describe your cleanliness level and expectations?",
    "Do you prefer a quiet environment or are you okay with some background noise?",
    "How often do you have friends or guests over?",
    "What's most important to you in a roommate relationship?"
  ];

  useEffect(() => {
    // Check for microphone permissions and browser support
    checkMicrophonePermissions();
    initializeSpeechRecognition();
    
    // Load saved OmniDim configuration from localStorage
    const savedConfig = localStorage.getItem('omnidim-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setOmniDimConfig(config);
        console.log('✅ Loaded saved OmniDimension configuration');
      } catch (error) {
        console.error('❌ Failed to load saved configuration:', error);
      }
    }
    
    return () => {
      cleanup();
    };
  }, []);

  const checkMicrophonePermissions = async () => {
    try {
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ Microphone access granted');
      toast({
        title: "Microphone access granted",
        description: "You can now use voice input for the survey",
      });
    } catch (error) {
      setHasPermission(false);
      console.error('❌ Microphone access denied:', error);
      toast({
        title: "Microphone access needed",
        description: "Please allow microphone access to use voice input",
        variant: "destructive",
      });
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        console.log('🗣️ Speech recognition started');
        setIsListening(true);
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log('📝 Speech recognition result:', transcript);
        setCurrentAnswer(transcript);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
        console.log('🛑 Speech recognition ended');
      };
      
      recognitionRef.current = recognition;
    } else {
      console.warn('⚠️ Speech recognition not supported in this browser');
      toast({
        title: "Speech recognition not supported",
        description: "Please use Chrome or Edge for voice input",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      if (!hasPermission) {
        await checkMicrophonePermissions();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log('🎵 Audio recording completed, blob size:', audioBlob.size, 'bytes');
        
        // If we have OmniDim config, we could send to their API here
        if (omniDimConfig.apiKey) {
          console.log('🚀 Sending to OmniDimension for processing...');
          processWithOmniDim(audioBlob);
        } else {
          console.log('ℹ️ No OmniDim API key, using local speech recognition only');
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
      // Also start speech recognition for real-time transcript
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      toast({
        title: "Recording started",
        description: "Speak your answer now...",
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Could not start recording. Please check microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    toast({
      title: "Recording stopped",
      description: "Processing your response...",
    });
  };

  const processWithOmniDim = async (audioBlob: Blob) => {
    try {
      console.log('🎙️ Processing audio with OmniDim API...');
      console.log('📊 Audio blob size:', audioBlob.size, 'bytes');
      console.log('📊 Audio blob type:', audioBlob.type);
      
      if (!omniDimConfig.apiKey) {
        console.warn('⚠️ No OmniDim API key provided');
        toast({
          title: "Configuration needed",
          description: "Please enter your OmniDim API key in settings",
          variant: "destructive",
        });
        return;
      }

      const client = new OmniDimensionClient(omniDimConfig.apiKey, omniDimConfig.agentId);
      
      // Test connection first
      const isConnected = await client.testConnection();
      if (!isConnected) {
        throw new Error('Failed to connect to OmniDimension API');
      }

      // Process the audio
      const result = await client.processAudio(audioBlob, `roommate_survey_question_${currentQuestion + 1}`);
      
      if (result.success && result.transcript) {
        console.log('✅ OmniDim transcript:', result.transcript);
        setCurrentAnswer(result.transcript);
        
        toast({
          title: "Voice processed successfully",
          description: "OmniDimension has analyzed your response",
        });
      } else {
        throw new Error(result.error || 'Failed to process audio');
      }
      
    } catch (error) {
      console.error('❌ Error processing with OmniDim:', error);
      toast({
        title: "Processing error",
        description: "Failed to process audio with OmniDim API. Using local transcription.",
        variant: "destructive",
      });
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording || isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const analyzeResponse = (answer: string): string => {
    // Simple analysis based on keywords - in real app this would use AI
    const lowerAnswer = answer.toLowerCase();
    
    if (currentQuestion === 0) { // Sleep schedule
      if (lowerAnswer.includes('11') || lowerAnswer.includes('early')) {
        return "Sleep schedule: Early bird pattern detected";
      } else if (lowerAnswer.includes('12') || lowerAnswer.includes('midnight')) {
        return "Sleep schedule: Night owl pattern detected";
      }
      return "Sleep schedule: Moderate timing preferences";
    }
    
    if (currentQuestion === 1) { // Cleanliness
      if (lowerAnswer.includes('very') || lowerAnswer.includes('organized') || lowerAnswer.includes('tidy')) {
        return "Cleanliness: High standards, organized lifestyle";
      }
      return "Cleanliness: Standard expectations";
    }
    
    if (currentQuestion === 2) { // Noise preference
      if (lowerAnswer.includes('quiet') || lowerAnswer.includes('peaceful')) {
        return "Noise preference: Quiet, values peaceful environment";
      }
      return "Noise preference: Moderate tolerance for background noise";
    }
    
    if (currentQuestion === 3) { // Social habits
      if (lowerAnswer.includes('occasionally') || lowerAnswer.includes('weekend')) {
        return "Social habits: Moderate social activity, weekend focus";
      }
      return "Social habits: Regular social interactions";
    }
    
    if (currentQuestion === 4) { // Values
      if (lowerAnswer.includes('respect') || lowerAnswer.includes('space') || lowerAnswer.includes('boundaries')) {
        return "Values: Privacy-focused, respects boundaries";
      }
      return "Values: Open communication and mutual respect";
    }
    
    return "Response analyzed and categorized";
  };

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "No response recorded",
        description: "Please provide an answer before continuing.",
        variant: "destructive",
      });
      return;
    }

    const newResponse = {
      question: questions[currentQuestion],
      answer: currentAnswer,
      analysis: analyzeResponse(currentAnswer),
      audioBlob: audioChunksRef.current.length > 0 ? new Blob(audioChunksRef.current, { type: 'audio/webm' }) : undefined
    };
    
    setResponses([...responses, newResponse]);
    setCurrentAnswer('');
    audioChunksRef.current = [];
    
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Voice-Powered Compatibility Survey
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowConfig(!showConfig)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          {showConfig && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-left">
              <h3 className="font-medium mb-2">🔑 OmniDimension Configuration</h3>
              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="Enter your OmniDim API Key"
                    value={omniDimConfig.apiKey}
                    onChange={(e) => {
                      const newConfig = {...omniDimConfig, apiKey: e.target.value};
                      setOmniDimConfig(newConfig);
                      // Save to localStorage for persistence
                      localStorage.setItem('omnidim-config', JSON.stringify(newConfig));
                    }}
                    type="password"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Agent ID (optional)"
                    value={omniDimConfig.agentId || ''}
                    onChange={(e) => {
                      const newConfig = {...omniDimConfig, agentId: e.target.value};
                      setOmniDimConfig(newConfig);
                      localStorage.setItem('omnidim-config', JSON.stringify(newConfig));
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>🔗 Get your API key from the <a href="https://www.omnidim.io/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OmniDimension Dashboard</a></p>
                  <p>🔒 API key is stored locally in your browser</p>
                  <p>⚠️ For production apps, use Supabase for secure storage</p>
                </div>
                {omniDimConfig.apiKey && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={async () => {
                      const client = new OmniDimensionClient(omniDimConfig.apiKey);
                      const isConnected = await client.testConnection();
                      toast({
                        title: isConnected ? "Connection successful!" : "Connection failed",
                        description: isConnected ? "OmniDimension API is ready" : "Please check your API key",
                        variant: isConnected ? "default" : "destructive",
                      });
                    }}
                  >
                    Test Connection
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <Progress value={progress} className="w-full mt-4" />
          <p className="text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          
          {hasPermission === false && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-destructive text-sm">
                Microphone access required for voice recording
              </span>
            </div>
          )}
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
              variant={isRecording || isListening ? "voice" : "hero"}
              size="xl"
              onClick={handleVoiceToggle}
              className="w-32 h-32 rounded-full"
              disabled={hasPermission === false}
            >
              {isRecording || isListening ? (
                <MicOff className="w-12 h-12" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              {isRecording ? "Recording... Speak naturally" : 
               isListening ? "Processing speech..." :
               hasPermission === false ? "Microphone access needed" :
               "Tap to start recording"}
            </p>
            
            {hasPermission === false && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkMicrophonePermissions}
              >
                Enable Microphone
              </Button>
            )}
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
              disabled={!currentAnswer.trim()}
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