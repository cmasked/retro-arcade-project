import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Star, Target, Zap, Crown, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface UserAchievement {
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-login',
    title: 'SYSTEM ONLINE',
    description: 'Complete your first login to the arcade',
    icon: 'Zap',
    requirement: 1,
    category: 'System',
    rarity: 'common',
    points: 10
  },
  {
    id: 'profile-complete',
    title: 'IDENTITY CONFIRMED',
    description: 'Fill out your complete player profile',
    icon: 'Star',
    requirement: 1,
    category: 'Profile',
    rarity: 'common',
    points: 25
  },
  {
    id: 'settings-master',
    title: 'CONFIG WIZARD',
    description: 'Customize all your game settings',
    icon: 'Target',
    requirement: 1,
    category: 'Configuration',
    rarity: 'rare',
    points: 50
  },
  {
    id: 'seven-day-streak',
    title: 'WEEKLY WARRIOR',
    description: 'Log in for 7 consecutive days',
    icon: 'Trophy',
    requirement: 7,
    category: 'Engagement',
    rarity: 'rare',
    points: 100
  },
  {
    id: 'achievement-hunter',
    title: 'TROPHY COLLECTOR',
    description: 'Unlock 10 achievements',
    icon: 'Award',
    requirement: 10,
    category: 'Meta',
    rarity: 'epic',
    points: 200
  },
  {
    id: 'arcade-legend',
    title: 'ARCADE LEGEND',
    description: 'Reach maximum level in all categories',
    icon: 'Crown',
    requirement: 100,
    category: 'Mastery',
    rarity: 'legendary',
    points: 500
  }
];

const Achievements = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userAchievements, setUserAchievements] = useState<Record<string, UserAchievement>>({});
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserAchievements();
      checkAndUnlockAchievements();
    }
  }, [user]);

  const fetchUserAchievements = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching achievements:', error);
        return;
      }

      const achievementsMap: Record<string, UserAchievement> = {};
      let points = 0;

      data?.forEach((achievement) => {
        achievementsMap[achievement.achievement_id] = achievement;
        if (achievement.completed) {
          const achData = ACHIEVEMENTS.find(a => a.id === achievement.achievement_id);
          if (achData) points += achData.points;
        }
      });

      setUserAchievements(achievementsMap);
      setTotalPoints(points);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const checkAndUnlockAchievements = async () => {
    if (!user) return;

    // Check first login achievement
    await updateAchievementProgress('first-login', 1);

    // Check profile completion
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profile && profile.username && profile.display_name) {
      await updateAchievementProgress('profile-complete', 1);
    }

    // Check settings configuration
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settings) {
      await updateAchievementProgress('settings-master', 1);
    }
  };

  const updateAchievementProgress = async (achievementId: string, progress: number) => {
    if (!user) return;

    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;

    const completed = progress >= achievement.requirement;
    
    try {
      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          progress,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        }, { onConflict: 'user_id,achievement_id' });

      if (error) {
        console.error('Error updating achievement:', error);
      } else {
        fetchUserAchievements();
      }
    } catch (error) {
      console.error('Error updating achievement:', error);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Zap, Star, Target, Trophy, Award, Crown
    };
    return icons[iconName] || Trophy;
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-muted-foreground',
      rare: 'text-secondary neon-cyan',
      epic: 'text-primary neon-pink',
      legendary: 'text-accent neon-green'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      common: 'bg-muted text-muted-foreground',
      rare: 'bg-secondary/20 text-secondary border-secondary',
      epic: 'bg-primary/20 text-primary border-primary',
      legendary: 'bg-accent/20 text-accent border-accent'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-neon scanlines">
        <div className="text-center space-y-4">
          <Trophy className="h-16 w-16 text-primary animate-retro-spin mx-auto" />
          <p className="font-8bit text-lg neon-pink">LOADING ACHIEVEMENTS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completedCount = Object.values(userAchievements).filter(a => a.completed).length;
  const totalAchievements = ACHIEVEMENTS.length;

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
            <Trophy className="h-8 w-8 text-primary animate-neon-pulse" />
            <h1 className="text-xl font-8bit neon-pink">ACHIEVEMENTS</h1>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="relative z-10 px-6 mb-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-8bit neon-pink">{completedCount}</div>
                  <div className="text-sm font-retro text-muted-foreground">Unlocked</div>
                </div>
                <div>
                  <div className="text-2xl font-8bit neon-cyan">{totalPoints}</div>
                  <div className="text-sm font-retro text-muted-foreground">Total Points</div>
                </div>
                <div>
                  <div className="text-2xl font-8bit neon-green">{Math.round((completedCount / totalAchievements) * 100)}%</div>
                  <div className="text-sm font-retro text-muted-foreground">Completion</div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={(completedCount / totalAchievements) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((achievement) => {
              const userAch = userAchievements[achievement.id];
              const progress = userAch?.progress || 0;
              const completed = userAch?.completed || false;
              const IconComponent = getIconComponent(achievement.icon);

              return (
                <Card 
                  key={achievement.id} 
                  className={`bg-card/50 backdrop-blur-sm border-2 transition-all duration-300 ${
                    completed 
                      ? 'border-primary/50 shadow-neon-pink' 
                      : 'border-muted/20 hover:border-secondary/30'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${completed ? 'bg-primary/20' : 'bg-muted/20'}`}>
                          <IconComponent 
                            className={`h-6 w-6 ${completed ? getRarityColor(achievement.rarity) : 'text-muted-foreground'}`} 
                          />
                        </div>
                        <div>
                          <CardTitle className={`font-8bit text-sm ${completed ? getRarityColor(achievement.rarity) : 'text-muted-foreground'}`}>
                            {achievement.title}
                          </CardTitle>
                          <Badge variant="outline" className={`text-xs ${getRarityBadge(achievement.rarity)}`}>
                            {achievement.rarity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-8bit text-xs ${completed ? 'neon-green' : 'text-muted-foreground'}`}>
                          {achievement.points} PTS
                        </div>
                        {completed && (
                          <div className="text-xs text-muted-foreground">
                            {userAch?.completed_at && new Date(userAch.completed_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-retro text-muted-foreground mb-3">
                      {achievement.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-retro">
                        <span>Progress</span>
                        <span>{Math.min(progress, achievement.requirement)}/{achievement.requirement}</span>
                      </div>
                      <Progress 
                        value={(Math.min(progress, achievement.requirement) / achievement.requirement) * 100} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 text-center">
        <Button
          onClick={() => navigate('/')}
          className="bg-gradient-primary hover:shadow-neon-pink font-8bit text-xs px-8"
        >
          RETURN TO GAME
        </Button>
      </div>
    </div>
  );
};

export default Achievements;