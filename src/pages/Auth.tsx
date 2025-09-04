import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Gamepad2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-gradient-neon relative overflow-hidden scanlines">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-background/95"></div>
      <div className="absolute top-10 left-10 w-4 h-4 bg-primary rounded-full animate-pixel-float"></div>
      <div className="absolute top-32 right-20 w-6 h-6 bg-secondary rounded-full animate-pixel-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-32 w-3 h-3 bg-accent rounded-full animate-pixel-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 right-10 w-5 h-5 bg-primary rounded-full animate-pixel-float" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Gamepad2 className="h-20 w-20 text-primary animate-retro-spin" />
            </div>
            <h1 className="text-4xl font-8bit neon-pink glitch">
              RETRO ARCADE
            </h1>
            <p className="text-lg font-retro text-secondary neon-cyan">
              Enter the Neon Realm
            </p>
          </div>

          {/* Auth Form */}
          <div className="space-y-6">
            {isLogin ? (
              <LoginForm onToggleMode={toggleMode} />
            ) : (
              <SignUpForm onToggleMode={toggleMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;