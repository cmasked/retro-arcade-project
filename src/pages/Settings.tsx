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
  language?: string;
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
      // TODO: Replace with actual database call once types are generated
      // Mock settings for now - in real app this would fetch from supabase
      console.log('Fetching settings for user:', user.id);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    setIsLoading(true);
    const updatedSettings = { ...settings, ...newSettings, user_id: user.id };
    
    try {
      // TODO: Replace with actual database call once types are generated
      // await supabase.from('user_settings').upsert(updatedSettings, { onConflict: 'user_id' });

      setSettings(updatedSettings);
      toast({
        title: "CONFIGURATION UPDATED",
        description: "Your space station settings have been synchronized.",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "SYNC ERROR", 
        description: "Failed to update station configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-galaxy nebula-bg">
        <div className="text-center space-y-4">
          <SettingsIcon className="h-16 w-16 text-primary animate-stellar-pulse mx-auto" />
          <p className="font-space text-lg glow-blue">INITIALIZING CONTROLS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-galaxy relative overflow-hidden nebula-bg">
      <div className="absolute inset-0 bg-background/90"></div>
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-cosmic-drift shadow-stellar-blue"></div>
      <div className="absolute bottom-32 right-32 w-1 h-1 bg-secondary rounded-full animate-cosmic-drift shadow-cosmic-cyan" style={{ animationDelay: '3s' }}></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="holo-border bg-card/40 font-cosmic text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK
          </Button>
          <div className="flex items-center gap-4">
            <SettingsIcon className="h-8 w-8 text-secondary animate-stellar-pulse" />
            <h1 className="text-xl font-space glow-cyan">SHIP CONTROLS</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Audio Settings */}
          <Card className="bg-card/40 backdrop-blur-sm holo-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-space text-sm glow-blue">
                <Volume2 className="h-5 w-5" />
                AUDIO SYSTEMS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="font-cosmic text-sm">Sound Effects</Label>
                <Switch
                  checked={settings.sound_enabled}
                  onCheckedChange={(checked) => updateSettings({ sound_enabled: checked })}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="font-cosmic text-sm">Background Music</Label>
                <Switch
                  checked={settings.music_enabled}
                  onCheckedChange={(checked) => updateSettings({ music_enabled: checked })}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-3">
                <Label className="font-cosmic text-sm">Master Volume: {settings.volume}%</Label>
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

          {/* Mission Settings */}
          <Card className="bg-card/40 backdrop-blur-sm holo-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-space text-sm glow-cyan">
                <Gamepad2 className="h-5 w-5" />
                MISSION CONTROL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="font-cosmic text-sm">Auto-Save Progress</Label>
                <Switch
                  checked={settings.auto_save}
                  onCheckedChange={(checked) => updateSettings({ auto_save: checked })}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-3">
                <Label className="font-cosmic text-sm">Mission Difficulty</Label>
                <Select 
                  value={settings.difficulty} 
                  onValueChange={(value) => updateSettings({ difficulty: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="holo-border bg-card/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">CADET</SelectItem>
                    <SelectItem value="normal">COMMANDER</SelectItem>
                    <SelectItem value="hard">ADMIRAL</SelectItem>
                    <SelectItem value="expert">FLEET CAPTAIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="bg-card/40 backdrop-blur-sm holo-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-space text-sm glow-pink">
                <Palette className="h-5 w-5" />
                SYSTEM CONFIG
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="font-cosmic text-sm">Mission Alerts</Label>
                <Switch
                  checked={settings.notifications_enabled}
                  onCheckedChange={(checked) => updateSettings({ notifications_enabled: checked })}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-3">
                <Label className="font-cosmic text-sm">Interface Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => updateSettings({ theme: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="holo-border bg-card/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="space">DEEP SPACE</SelectItem>
                    <SelectItem value="light">STELLAR LIGHT</SelectItem>
                    <SelectItem value="classic">GALACTIC CLASSIC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => navigate('/')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-space px-8 py-3 holo-border shadow-stellar-blue"
              disabled={isLoading}
            >
              {isLoading ? 'SYNCHRONIZING...' : 'RETURN TO STATION'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;