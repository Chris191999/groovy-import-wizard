import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginData, SignupData, ForgotPasswordData } from '@/lib/schemas/auth';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Mail, MessageCircle } from 'lucide-react';

const AuthPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    }
    // On success, the onAuthStateChange in AuthContext will handle redirection
    // via the useEffect that watches the session.
  };

  const handleSignup = async (data: SignupData): Promise<boolean> => {
    setLoading(true);
    console.log('Starting signup process for:', data.email);
    
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error('Signup error:', error);
      toast.error(error.message);
      setLoading(false);
      return false;
    }

    console.log('User signed up successfully, now sending admin notification...');

    // Notify admin via Edge Function
    try {
      const { data: notificationData, error: notificationError } = await supabase.functions.invoke('send-signup-notification', {
        body: {
          fullName: data.fullName,
          email: data.email,
          pricingPlan: data.pricingPlan,
          auraCode: data.auraCode,
        },
      });

      if (notificationError) {
        console.error('Error sending admin notification:', notificationError);
        // Don't block signup if notification fails
        toast.warning('Account created but admin notification failed. Please contact support.');
      } else {
        console.log('Admin notification sent successfully:', notificationData);
      }
    } catch (e) {
      console.error('Failed to send admin notification:', e);
      // Don't block signup if notification fails
      toast.warning('Account created but admin notification failed. Please contact support.');
    }

    setLoading(false);
    toast.success('Check your email for a confirmation link. Your account will be active after admin approval.');
    return true;
  };

  const handleForgotPassword = async (data: ForgotPasswordData) => {
    setLoading(true);

    const { data: status, error: rpcError } = await supabase.rpc(
      "get_user_status_by_email",
      { p_email: data.email }
    );
    
    if (rpcError) {
      console.error("Error fetching user status:", rpcError);
      // To prevent email enumeration attacks, we show a generic success message.
      toast.success("If an account with this email exists, a password reset link has been sent.");
      setIsForgotPasswordView(false);
      setLoading(false);
      return;
    }

    if (status === 'inactive') {
      toast.error('Your account is inactive. Please contact support.');
      setLoading(false);
      return; // Stay on the same view to show the error
    }

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("If an account with this email exists, a password reset link has been sent.");
      setIsForgotPasswordView(false);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);
  
  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen dark-tech-bg relative overflow-hidden">
      {/* Floating orbs background effect */}
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      
      {/* Main content */}
      <div className="flex justify-center items-center min-h-screen relative z-10">
        <Card className="w-[400px] glass-morphism border-0 shadow-2xl">
          <CardHeader className="flex flex-col items-center gap-2 pb-2">
            <img
              src="/THT-Trademind LOGO resized .png "
                alt="Logo"
              className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 shadow-lg mx-auto bg-gray-900"
              style={{ display: 'block' }}
            />
            <div className="text-center mt-2">
              <div className="text-lg font-bold tracking-wide text-[#872bdb]">The House of Traders</div>
              <div className="text-2xl font-extrabold drop-shadow-sm text-[#f5dd01]">Trademind</div>
              <div className="text-xs text-gray-400 mt-1">The Holy App for Traders</div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-morphism">
                <TabsTrigger value="login" onClick={() => setIsForgotPasswordView(false)} className="text-white data-[state=active]:bg-white/20">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                {isForgotPasswordView ? (
                  <ForgotPasswordForm 
                    onForgotPassword={handleForgotPassword}
                    onBackToLogin={() => setIsForgotPasswordView(false)}
                    loading={loading}
                  />
                ) : (
                  <LoginForm 
                    onLogin={handleLogin}
                    onForgotPassword={() => setIsForgotPasswordView(true)}
                    loading={loading}
                  />
                )}
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm onSignup={handleSignup} loading={loading} />
              </TabsContent>
            </Tabs>
            <div className="mt-8 border-t border-white/10 pt-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-gray-400">Contact Us</span>
                <a href="mailto:Thehouseoftraders69@gmail.com" className="flex items-center gap-1 text-yellow-400 hover:underline text-sm">
                  <Mail size={16} className="inline-block" /> Thehouseoftraders69@gmail.com
                </a>
                <a href="#" className="flex items-center gap-1 text-purple-400 opacity-60 cursor-not-allowed text-sm" tabIndex={-1} aria-disabled="true">
                  <img src="/discord-server.png" alt="Discord" className="w-4 h-4 inline-block rounded-full bg-gray-800" style={{ filter: 'drop-shadow(0 1px 2px #0008)' }} /> Discord (coming soon)
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
