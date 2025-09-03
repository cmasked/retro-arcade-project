import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Zap } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-neon-pink">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <Gamepad2 className="h-12 w-12 text-primary animate-neon-pulse" />
        </div>
        <CardTitle className="text-2xl font-8bit neon-pink">
          PLAYER LOGIN
        </CardTitle>
        <CardDescription className="font-retro text-muted-foreground">
          Enter the arcade realm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="bg-input/50 border-primary/30 focus:border-primary focus:shadow-neon-pink font-retro"
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
              className="bg-input/50 border-primary/30 focus:border-primary focus:shadow-neon-pink font-retro"
              placeholder="••••••••"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary hover:shadow-neon-pink transition-all duration-300 font-8bit text-xs h-12 border-2 border-primary/50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 animate-retro-spin" />
                LOADING...
              </div>
            ) : (
              'START GAME'
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <button
            onClick={onToggleMode}
            className="text-secondary hover:text-secondary/80 font-8bit text-xs underline hover:no-underline transition-all duration-300 hover:shadow-neon-cyan"
          >
            NEW PLAYER? JOIN THE ARCADE
          </button>
        </div>
      </CardContent>
    </Card>
  );
};