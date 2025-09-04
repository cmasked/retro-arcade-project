import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Zap } from 'lucide-react';

interface SignUpFormProps {
  onToggleMode: () => void;
}

export const SignUpForm = ({ onToggleMode }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(email, password, username, displayName);
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border-2 border-secondary/20 shadow-neon-cyan">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-secondary animate-neon-pulse" />
        </div>
        <CardTitle className="text-2xl font-8bit neon-cyan">
          JOIN ARCADE
        </CardTitle>
        <CardDescription className="font-retro text-muted-foreground">
          Create your player profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="font-8bit text-xs text-foreground">
              DISPLAY NAME
            </Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-input/50 border-secondary/30 focus:border-secondary focus:shadow-neon-cyan font-retro"
              placeholder="Arcade Master"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="font-8bit text-xs text-foreground">
              USERNAME
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-input/50 border-secondary/30 focus:border-secondary focus:shadow-neon-cyan font-retro"
              placeholder="player1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-8bit text-xs text-foreground">
              EMAIL
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input/50 border-secondary/30 focus:border-secondary focus:shadow-neon-cyan font-retro"
              placeholder="player@arcade.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-8bit text-xs text-foreground">
              PASSWORD
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input/50 border-secondary/30 focus:border-secondary focus:shadow-neon-cyan font-retro"
              placeholder="••••••••"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-secondary hover:shadow-neon-cyan transition-all duration-300 font-8bit text-xs h-12 border-2 border-secondary/50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 animate-retro-spin" />
                CREATING...
              </div>
            ) : (
              'CREATE PLAYER'
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <button
            onClick={onToggleMode}
            className="text-primary hover:text-primary/80 font-8bit text-xs underline hover:no-underline transition-all duration-300 hover:shadow-neon-pink"
          >
            ALREADY A PLAYER? LOGIN HERE
          </button>
        </div>
      </CardContent>
    </Card>
  );
};