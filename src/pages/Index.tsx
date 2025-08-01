import React, { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import VoiceSurvey from '@/components/VoiceSurvey';
import MatchingResults from '@/components/MatchingResults';
import AdminDashboard from '@/components/AdminDashboard';

type AppState = 'landing' | 'survey' | 'results' | 'admin';

interface SurveyResponse {
  question: string;
  answer: string;
  analysis: string;
}

interface MatchResult {
  id: string;
  name: string;
  age: number;
  occupation: string;
  compatibilityScore: number;
  matchReasons: string[];
  room: {
    number: string;
    floor: number;
    amenities: string[];
    rent: number;
  };
  lifestyle: {
    sleepSchedule: string;
    cleanliness: string;
    socialLevel: string;
  };
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);

  // Mock matching algorithm
  const generateMatches = (responses: SurveyResponse[]): MatchResult[] => {
    const mockMatches: MatchResult[] = [
      {
        id: '1',
        name: 'Emma Wilson',
        age: 24,
        occupation: 'Marketing Manager',
        compatibilityScore: 94,
        matchReasons: [
          'Similar sleep schedule (early bird)',
          'High cleanliness standards',
          'Quiet lifestyle preference',
          'Professional work environment'
        ],
        room: {
          number: 'A-204',
          floor: 2,
          amenities: ['Window view', 'Shared bathroom', 'Study area'],
          rent: 1200
        },
        lifestyle: {
          sleepSchedule: 'Early bird (11 PM - 7 AM)',
          cleanliness: 'Very high',
          socialLevel: 'Moderate'
        }
      },
      {
        id: '2',
        name: 'Maya Patel',
        age: 26,
        occupation: 'UX Designer',
        compatibilityScore: 87,
        matchReasons: [
          'Creative professional background',
          'Organized living style',
          'Respectful of boundaries',
          'Weekend social activities'
        ],
        room: {
          number: 'B-301',
          floor: 3,
          amenities: ['Balcony access', 'Private bathroom', 'Work desk'],
          rent: 1300
        },
        lifestyle: {
          sleepSchedule: 'Night owl (12 AM - 8 AM)',
          cleanliness: 'High',
          socialLevel: 'Social'
        }
      },
      {
        id: '3',
        name: 'Jessica Chen',
        age: 25,
        occupation: 'Data Analyst',
        compatibilityScore: 82,
        matchReasons: [
          'Tech industry compatibility',
          'Structured lifestyle',
          'Minimal guest policy',
          'Study-focused environment'
        ],
        room: {
          number: 'A-205',
          floor: 2,
          amenities: ['Quiet zone', 'Shared bathroom', 'Storage space'],
          rent: 1150
        },
        lifestyle: {
          sleepSchedule: 'Early bird (10 PM - 6 AM)',
          cleanliness: 'High',
          socialLevel: 'Low-key'
        }
      }
    ];

    // Sort by compatibility score
    return mockMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  };

  const handleSurveyComplete = (responses: SurveyResponse[]) => {
    setSurveyResponses(responses);
    setCurrentState('results');
  };

  const handleMatchSelect = (match: MatchResult) => {
    // In a real app, this would save the selection to the backend
    console.log('Selected match:', match);
    alert(`Congratulations! You've been matched with ${match.name}. Room ${match.room.number} has been reserved for you.`);
    setCurrentState('landing');
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'landing':
        return (
          <LandingPage 
            onStartSurvey={() => setCurrentState('survey')}
            onViewAdmin={() => setCurrentState('admin')}
          />
        );
      case 'survey':
        return <VoiceSurvey onComplete={handleSurveyComplete} />;
      case 'results':
        const matches = generateMatches(surveyResponses);
        return <MatchingResults matches={matches} onSelectMatch={handleMatchSelect} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <LandingPage 
            onStartSurvey={() => setCurrentState('survey')}
            onViewAdmin={() => setCurrentState('admin')}
          />
        );
    }
  };

  return renderCurrentState();
};

export default Index;
