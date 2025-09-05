import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProfileUpdate } from '@/components/profile/ProfileUpdate';
import { Rocket, LogOut, Settings, Trophy, Zap, Star } from 'lucide-react';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-galaxy nebula-bg">
        <div className="text-center space-y-4">
          <Rocket className="h-16 w-16 text-primary animate-stellar-pulse mx-auto" />
          <p className="font-space text-lg glow-blue">INITIALIZING SPACE STATION...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-galaxy relative overflow-hidden nebula-bg">
      {/* Background elements - floating stars */}
      <div className="absolute inset-0 bg-background/90"></div>
      <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-cosmic-drift shadow-stellar-blue"></div>
      <div className="absolute top-32 right-20 w-3 h-3 bg-secondary rounded-full animate-cosmic-drift shadow-cosmic-cyan" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-32 w-1 h-1 bg-accent rounded-full animate-cosmic-drift shadow-nebula-pink" style={{ animationDelay: '4s' }}></div>
      <div className="absolute bottom-40 right-10 w-2 h-2 bg-primary rounded-full animate-cosmic-drift shadow-stellar-blue" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full animate-cosmic-drift" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-white rounded-full animate-cosmic-drift" style={{ animationDelay: '5s' }}></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Rocket className="h-10 w-10 text-primary animate-stellar-pulse" />
            <h1 className="text-2xl font-space glow-blue">STELLAR STATION</h1>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="bg-destructive/10 border-destructive hover:bg-destructive hover:text-destructive-foreground font-futuristic text-xs holo-border"
          >
            <LogOut className="h-4 w-4 mr-2" />
            DISCONNECT
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] p-4">
        <div className="w-full max-w-4xl space-y-8">
          {/* Welcome message */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-space glow-cyan stellar-pulse">
              WELCOME ABOARD, COMMANDER!
            </h2>
            <p className="text-lg font-cosmic text-muted-foreground">
              Command ID: <span className="text-secondary glow-cyan">{user.email}</span>
            </p>
          </div>

          {/* Profile section */}
          <div className="flex justify-center">
            <ProfileUpdate />
          </div>

          {/* Space features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <button 
              onClick={() => navigate('/achievements')}
              className="bg-card/40 backdrop-blur-sm holo-border p-6 text-center hover:shadow-stellar-blue transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <Zap className="h-12 w-12 text-primary mx-auto mb-4 animate-cosmic-drift group-hover:animate-stellar-pulse" />
              <h3 className="font-space text-sm glow-blue mb-2">MISSION LOG</h3>
              <p className="font-cosmic text-xs text-muted-foreground">Track your expeditions</p>
            </button>
            
            <button 
              onClick={() => navigate('/settings')}
              className="bg-card/40 backdrop-blur-sm holo-border p-6 text-center hover:shadow-cosmic-cyan transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <Settings className="h-12 w-12 text-secondary mx-auto mb-4 animate-cosmic-drift group-hover:animate-stellar-pulse" style={{ animationDelay: '2s' }} />
              <h3 className="font-space text-sm glow-cyan mb-2">CONTROLS</h3>
              <p className="font-cosmic text-xs text-muted-foreground">Configure your ship</p>
            </button>
            
            <button 
              onClick={() => navigate('/achievements')}
              className="bg-card/40 backdrop-blur-sm holo-border p-6 text-center hover:shadow-nebula-pink transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <Star className="h-12 w-12 text-accent mx-auto mb-4 animate-cosmic-drift group-hover:animate-stellar-pulse" style={{ animationDelay: '4s' }} />
              <h3 className="font-space text-sm glow-pink mb-2">HONORS</h3>
              <p className="font-cosmic text-xs text-muted-foreground">Galactic achievements</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
