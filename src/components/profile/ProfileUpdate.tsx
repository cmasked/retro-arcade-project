import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Save, Zap } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
}

export const ProfileUpdate = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setUsername(data.username || '');
        setDisplayName(data.display_name || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const profileData = {
        user_id: user.id,
        username: username || null,
        display_name: displayName || null,
        avatar_url: avatarUrl || null,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'user_id'
        });

      if (error) {
        toast({
          title: "Profile Update Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profile Updated!",
          description: "Your player profile has been synchronized.",
        });
        fetchProfile(); // Refresh the profile data
      }
    } catch (error: any) {
      toast({
        title: "Profile Update Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border-2 border-accent/20 shadow-neon-green">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <User className="h-12 w-12 text-accent animate-neon-pulse" />
        </div>
        <CardTitle className="text-2xl font-8bit neon-green">
          PLAYER PROFILE
        </CardTitle>
        <CardDescription className="font-retro text-muted-foreground">
          Update your arcade identity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={updateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-8bit text-xs text-foreground">
              EMAIL (READ-ONLY)
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email || ''}
              disabled
              className="bg-muted/50 border-muted text-muted-foreground font-retro"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName" className="font-8bit text-xs text-foreground">
              DISPLAY NAME
            </Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-input/50 border-accent/30 focus:border-accent focus:shadow-neon-green font-retro"
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
              className="bg-input/50 border-accent/30 focus:border-accent focus:shadow-neon-green font-retro"
              placeholder="player1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatarUrl" className="font-8bit text-xs text-foreground">
              AVATAR URL
            </Label>
            <Input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="bg-input/50 border-accent/30 focus:border-accent focus:shadow-neon-green font-retro"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-accent hover:shadow-neon-green transition-all duration-300 font-8bit text-xs h-12 border-2 border-accent/50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 animate-retro-spin" />
                SYNCING...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                SAVE PROFILE
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};