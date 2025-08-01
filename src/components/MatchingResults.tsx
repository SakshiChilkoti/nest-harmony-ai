import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, MapPin, Clock, Users, Heart, CheckCircle } from 'lucide-react';

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

interface MatchingResultsProps {
  matches: MatchResult[];
  onSelectMatch: (match: MatchResult) => void;
}

const MatchingResults: React.FC<MatchingResultsProps> = ({ matches, onSelectMatch }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-purple-600 bg-purple-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Your Perfect Roommate Matches
          </h1>
          <p className="text-muted-foreground text-lg">
            Based on your preferences, here are your top compatible roommates
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match, index) => (
            <Card key={match.id} className="shadow-floating hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-secondary text-secondary-foreground font-semibold">
                        {match.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{match.name}</h3>
                      <p className="text-sm text-muted-foreground">{match.age} • {match.occupation}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Top Match
                    </Badge>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Compatibility Score</span>
                    <Badge className={`font-bold ${getScoreColor(match.compatibilityScore)}`}>
                      {match.compatibilityScore}%
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getScoreLabel(match.compatibilityScore)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    Why you match
                  </h4>
                  <div className="space-y-1">
                    {match.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-accent" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Suggested Room
                  </h4>
                  <div className="bg-gradient-card p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Room {match.room.number}</span>
                      <span className="text-primary font-bold">${match.room.rent}/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Floor {match.room.floor} • {match.room.amenities.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Lifestyle Match
                  </h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sleep:</span>
                      <span>{match.lifestyle.sleepSchedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cleanliness:</span>
                      <span>{match.lifestyle.cleanliness}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Social:</span>
                      <span>{match.lifestyle.socialLevel}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4" 
                  variant={index === 0 ? "hero" : "default"}
                  onClick={() => onSelectMatch(match)}
                >
                  Select This Match
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingResults;