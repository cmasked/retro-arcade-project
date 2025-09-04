import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProfileUpdate } from '@/components/profile/ProfileUpdate';
import { Gamepad2, LogOut, Settings, Trophy } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-neon scanlines">
        <div className="text-center space-y-4">
          <Gamepad2 className="h-16 w-16 text-primary animate-retro-spin mx-auto" />
          <p className="font-8bit text-lg neon-pink">LOADING GAME...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-neon relative overflow-hidden scanlines">
      {/* Background elements */}
      <div className="absolute inset-0 bg-background/95"></div>
      <div className="absolute top-10 left-10 w-4 h-4 bg-primary rounded-full animate-pixel-float"></div>
      <div className="absolute top-32 right-20 w-6 h-6 bg-secondary rounded-full animate-pixel-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-32 w-3 h-3 bg-accent rounded-full animate-pixel-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 right-10 w-5 h-5 bg-primary rounded-full animate-pixel-float" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Gamepad2 className="h-10 w-10 text-primary animate-neon-pulse" />
            <h1 className="text-2xl font-8bit neon-pink">RETRO ARCADE</h1>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="bg-destructive/10 border-destructive hover:bg-destructive hover:text-destructive-foreground font-8bit text-xs"
          >
            <LogOut className="h-4 w-4 mr-2" />
            QUIT GAME
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] p-4">
        <div className="w-full max-w-4xl space-y-8">
          {/* Welcome message */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-8bit neon-cyan glitch">
              WELCOME BACK, PLAYER!
            </h2>
            <p className="text-lg font-retro text-muted-foreground">
              Email: <span className="text-secondary">{user.email}</span>
            </p>
          </div>

          {/* Profile section */}
          <div className="flex justify-center">
            <ProfileUpdate />
          </div>

          {/* Game features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <button 
              onClick={() => navigate('/achievements')}
              className="bg-card/50 backdrop-blur-sm border-2 border-primary/20 rounded-lg p-6 text-center hover:shadow-neon-pink transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Gamepad2 className="h-12 w-12 text-primary mx-auto mb-4 animate-pixel-float" />
              <h3 className="font-8bit text-sm neon-pink mb-2">HIGH SCORES</h3>
              <p className="font-retro text-xs text-muted-foreground">Track your best games</p>
            </button>
            
            <button 
              onClick={() => navigate('/settings')}
              className="bg-card/50 backdrop-blur-sm border-2 border-secondary/20 rounded-lg p-6 text-center hover:shadow-neon-cyan transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Settings className="h-12 w-12 text-secondary mx-auto mb-4 animate-pixel-float" style={{ animationDelay: '1s' }} />
              <h3 className="font-8bit text-sm neon-cyan mb-2">SETTINGS</h3>
              <p className="font-retro text-xs text-muted-foreground">Customize your experience</p>
            </button>
            
            <button 
              onClick={() => navigate('/achievements')}
              className="bg-card/50 backdrop-blur-sm border-2 border-accent/20 rounded-lg p-6 text-center hover:shadow-neon-green transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Trophy className="h-12 w-12 text-accent mx-auto mb-4 animate-pixel-float" style={{ animationDelay: '2s' }} />
              <h3 className="font-8bit text-sm neon-green mb-2">ACHIEVEMENTS</h3>
              <p className="font-retro text-xs text-muted-foreground">Unlock rewards</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
