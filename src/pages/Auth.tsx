import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const { signIn, signUp, user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if already logged in
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSigningIn(true);
      const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
      
      if (error) {
        toast({
          title: isSignUp ? 'Sign up failed' : 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
      } else if (isSignUp) {
        toast({
          title: 'Check your email',
          description: 'We sent you a confirmation link to complete your registration.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Authentication failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-base">
            {isSignUp 
              ? 'Start your journey to optimal health and habits' 
              : 'Your personal biohacking coach powered by AI'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSigningIn}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSigningIn}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSigningIn}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>{isSignUp ? 'Create Account' : 'Sign In'}</>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isSigningIn}
              className="text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
