import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Settings as SettingsIcon, Volume2, Bell, Gamepad2, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  id?: string;
  user_id: string;
  sound_enabled: boolean;
  music_enabled: boolean;
  notifications_enabled: boolean;
  volume: number;
  theme: string;
  difficulty: string;
  auto_save: boolean;
}

const Settings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    user_id: user?.id || '',
    sound_enabled: true,
    music_enabled: true,
    notifications_enabled: true,
    volume: 75,
    theme: 'dark',
    difficulty: 'normal',
    auto_save: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    setIsLoading(true);
    const updatedSettings = { ...settings, ...newSettings, user_id: user.id };
    
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert(updatedSettings, { onConflict: 'user_id' });

      if (error) {
        throw error;
      }

      setSettings(updatedSettings);
      toast({
        title: "SETTINGS SYNCED",
        description: "Your preferences have been saved!",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "SYNC ERROR", 
        description: "Failed to save settings. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-neon scanlines">
        <div className="text-center space-y-4">
          <SettingsIcon className="h-16 w-16 text-primary animate-retro-spin mx-auto" />
          <p className="font-8bit text-lg neon-pink">LOADING SETTINGS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-neon relative overflow-hidden scanlines">
      <div className="absolute inset-0 bg-background/95"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="bg-secondary/10 border-secondary hover:bg-secondary hover:text-secondary-foreground font-8bit text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK
          </Button>
          <div className="flex items-center gap-4">
            <SettingsIcon className="h-8 w-8 text-primary animate-neon-pulse" />
            <h1 className="text-xl font-8bit neon-cyan">GAME SETTINGS</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Audio Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-8bit text-sm neon-pink">
                <Volume2 className="h-5 w-5" />
                AUDIO CONTROLS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="font-retro text-sm">Sound Effects</Label>
                <Switch
                  checked={settings.sound_enabled}
                  onCheckedChange={(checked) => updateSettings({ sound_enabled: checked })}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="font-retro text-sm">Background Music</Label>
                <Switch
                  checked={settings.music_enabled}
                  onCheckedChange={(checked) => updateSettings({ music_enabled: checked })}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-3">
                <Label className="font-retro text-sm">Master Volume: {settings.volume}%</Label>
                <Slider
                  value={[settings.volume]}
                  onValueChange={(value) => updateSettings({ volume: value[0] })}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Game Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-8bit text-sm neon-cyan">
                <Gamepad2 className="h-5 w-5" />
                GAMEPLAY OPTIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="font-retro text-sm">Auto Save Progress</Label>
                <Switch
                  checked={settings.auto_save}
                  onCheckedChange={(checked) => updateSettings({ auto_save: checked })}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-3">
                <Label className="font-retro text-sm">Difficulty Level</Label>
                <Select 
                  value={settings.difficulty} 
                  onValueChange={(value) => updateSettings({ difficulty: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-input/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">ROOKIE</SelectItem>
                    <SelectItem value="normal">NORMAL</SelectItem>
                    <SelectItem value="hard">VETERAN</SelectItem>
                    <SelectItem value="expert">LEGEND</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-8bit text-sm neon-green">
                <Palette className="h-5 w-5" />
                SYSTEM PREFERENCES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="font-retro text-sm">Push Notifications</Label>
                <Switch
                  checked={settings.notifications_enabled}
                  onCheckedChange={(checked) => updateSettings({ notifications_enabled: checked })}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-3">
                <Label className="font-retro text-sm">Visual Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => updateSettings({ theme: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-input/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">NEON DARK</SelectItem>
                    <SelectItem value="light">RETRO LIGHT</SelectItem>
                    <SelectItem value="classic">CLASSIC ARCADE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-primary hover:shadow-neon-pink font-8bit text-xs px-8"
              disabled={isLoading}
            >
              {isLoading ? 'SYNCING...' : 'RETURN TO GAME'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;