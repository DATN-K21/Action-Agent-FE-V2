'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { loginSchema } from '@/validation-schemas/auth-schema';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/toast';
import { useState } from 'react';
import { Icons } from '@/components/icon';
import { signIn } from 'next-auth/react';
import {
  ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE,
  INVALID_LOGIN_ERROR_MESSAGE,
  Providers,
} from '@/constants/auth-constant';
import GoogleButton from './google-button';
import SendOTPDialog from './forgot-password/send-otp-dialog';
import ConfirmOTPDialog from './forgot-password/confirm-otp-dialog';
import ResetPasswordDialog from './forgot-password/reset-password-dialog';
import { sendAccountActivationEmail } from '@/services/auth-service';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
  const [isOTPDialogOpen, setOTPDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);

  const [forgotPasswordUserEmail, setForgotPasswordUserEmail] = useState<string>('');
  const [forgotPasswordInfo, setForgotPasswordInfo] = useState<{
    userId: string;
    resetPasswordToken: string;
  }>({
    userId: '',
    resetPasswordToken: '',
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);

    // Sign in with credentials using NextAuth
    const result = await signIn(Providers.Credentials, {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    // Handle login result
    if (result?.code === INVALID_LOGIN_ERROR_MESSAGE) {
      // Credentials are invalid
      toast({ type: 'error', description: INVALID_LOGIN_ERROR_MESSAGE });
      form.setValue('password', '');
    } else if (result?.code === ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE) {
      // Account is not verified
      toast({
        type: 'error',
        description: ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE,
      });

      // Send verification email
      sendAccountActivationEmail(data.email);

      form.reset();
    } else if (result?.code == 'credentials') {
      // Other error
      toast({
        type: 'error',
        description: 'An error occurred while logging in.',
      });
      form.reset();
    } else if (!result?.error) {
      // Login successful
      toast({ type: 'success', description: 'Login successful' });
      router.push('/');
    }

    setIsLoading(false);
  };

  // Handle after sending OTP successfully
  const handleSendOTPSucess = (email: string) => {
    setForgotPasswordUserEmail(email);
    setForgotPasswordDialogOpen(false);
    setOTPDialogOpen(true);
  };

  // Handle after verifying OTP successfully
  const handleVerifyOTPSucess = (userId: string, resetPasswordToken: string) => {
    setForgotPasswordInfo({ userId, resetPasswordToken });
    setOTPDialogOpen(false);
    setResetPasswordDialogOpen(true);
  };

  // Handle after resetting password successfully
  const handleResetPasswordSucess = () => {
    form.reset();
    setResetPasswordDialogOpen(false);
  };

  return (
    <>
      {/* Login Form */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back to Action Agent</CardTitle>
            <CardDescription>Login with your Google account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)}>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <GoogleButton isLoading={isLoading} />
                  </div>

                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>

                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              placeholder="m@example.com"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <div className="flex items-center">
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <div
                              className="ml-auto text-sm underline-offset-4 underline cursor-pointer"
                              onClick={() => setForgotPasswordDialogOpen(true)}
                            >
                              Forgot your password?
                            </div>
                          </div>
                          <FormControl>
                            <Input
                              id="password"
                              type="password"
                              required
                              placeholder="********"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
                      Login
                    </Button>
                  </div>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>

      <SendOTPDialog
        isOpen={isForgotPasswordDialogOpen}
        onClose={() => setForgotPasswordDialogOpen(false)}
        onSuccess={handleSendOTPSucess}
      />

      <ConfirmOTPDialog
        email={forgotPasswordUserEmail}
        isOpen={isOTPDialogOpen}
        onClose={() => setOTPDialogOpen(false)}
        onSuccess={handleVerifyOTPSucess}
      />

      <ResetPasswordDialog
        forgotPasswordInfo={forgotPasswordInfo}
        isOpen={isResetPasswordDialogOpen}
        onClose={handleResetPasswordSucess}
      />
    </>
  );
}
