import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Brain, Home, Shield, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-coliving.jpg';

interface LandingPageProps {
  onStartSurvey: () => void;
  onViewAdmin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartSurvey, onViewAdmin }) => {
  const features = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice-Powered Survey",
      description: "Natural conversation with AI to understand your preferences"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart AI Matching",
      description: "Advanced algorithm analyzes compatibility across multiple dimensions"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Perfect Room Assignment",
      description: "Optimal room placement based on lifestyle and match results"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "Privacy-first approach with secure data handling"
    }
  ];

  const benefits = [
    "Minimal 5-question survey saves time",
    "95% compatibility accuracy rate",
    "Real-time room availability updates",
    "24/7 voice assistant support",
    "Bias-free matching algorithm",
    "Instant match explanations"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Roommate Matching
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Roommate Match
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of women finding compatible roommates through our revolutionary 
            voice-powered AI matching system. Safe, smart, and surprisingly simple.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={onStartSurvey}
              className="text-lg font-semibold"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Voice Survey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              onClick={onViewAdmin}
              className="text-lg font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
            >
              Admin Dashboard
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-sm">Happy Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2 min</div>
              <div className="text-sm">Average Survey</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform makes finding compatible roommates effortless and accurate
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-gentle hover:shadow-floating transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Our
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  AI Matching System?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Traditional roommate finding is time-consuming and often inaccurate. Our AI 
                analyzes deep compatibility factors in minutes, not weeks.
              </p>
              
              <div className="grid gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button variant="gradient" size="lg" onClick={onStartSurvey}>
                  Get Started Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Card className="shadow-floating bg-gradient-card">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="bg-gradient-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-primary-foreground">
                      <Users className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">97% Match Success</h3>
                    <p className="text-muted-foreground mb-6">
                      Our advanced AI considers lifestyle, schedules, cleanliness, social preferences, 
                      and personal values to ensure lasting roommate relationships.
                    </p>
                    <Badge className="bg-accent/20 text-accent-foreground">
                      Powered by Omnidim.io Voice AI
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Roommate?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of women who've found their ideal living situation through our AI matching system
          </p>
          
          <Button 
            variant="hero" 
            size="xl" 
            onClick={onStartSurvey}
            className="text-lg font-semibold bg-white text-primary hover:bg-white/90"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Your Voice Survey Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;