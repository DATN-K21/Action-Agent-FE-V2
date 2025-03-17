'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
// import wretch from 'wretch';

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
// import OtpDialog from './otp-dialog';
import GoogleButton from './google-button';
import SendOTPDialog from './forgot-password/send-otp-dialog';
import ConfirmOTPDialog from './forgot-password/confirm-otp-dialog';
import ResetPasswordDialog from './forgot-password/reset-password-dialog';

export function LoginForm() {
  const router = useRouter();
  //const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowOtpDialog, setIsShowOtpDialog] = useState(false);
  const [isShowForgotPasswordDialog, setIsShowForgotPasswordDialog] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string>('');

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>('');
  const [isOtpDialogOpen, setIsOtpDiaLogOpen] = useState(false);
  const [isOpenForgotPassword, setIsOpenForgotPassword] = useState(false);
  const [infoForgotPassword, setInfoForgotPassword] = useState<{
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

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setVerificationEmail(data.email);

    // Sign in with credentials using NextAuth
    const result = await signIn(Providers.Credentials, {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.code === INVALID_LOGIN_ERROR_MESSAGE) {
      // Email or password is invalid
      toast({
        type: 'error',
        description: 'Invalid credentials!',
      });

      // toast({
      //   // variant: 'destructive',
      //   // title: 'Oops! Something went wrong.',
      //   description: result.code,
      // });

      form.setError('email', {
        type: 'manual',
        message: result.code,
      });

      form.setError('password', {
        type: 'manual',
        message: result.code,
      });
    } else if (result?.code === ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE) {
      // Account not verified
      // toast({
      //   // variant: 'destructive',
      //   // title: 'Oops! Something went wrong.',
      //   description: `${result.code}, please check your email for verification.`,
      // });

      toast({
        type: 'error',
        description: `${result.code}, please check your email for verification.`,
      });

      //await wretch('/api/access/verify/send-link').post({ email: data.email }).json();

      // Reset the form
      form.reset();
    } else if (!result?.error) {
      // Login successful
      // toast({
      //   // variant: 'success',
      //   // title: 'Success!',
      //   description: 'You have successfully logged in.',
      // });

      toast({
        type: 'success',
        description: 'You have successfully logged in.',
      });

      // Redirect to the home pages
      router.push('/');
    }

    setIsLoading(false);
  };

  const handleOpenForgetPasswordDialog = () => {
    // Open the OTP dialog
    setIsShowForgotPasswordDialog(true);
  };

  const handleEmailSubmit = (email: string) => {
    setForgotPasswordEmail(email);
    setIsShowForgotPasswordDialog(false);
    setIsOtpDiaLogOpen(true);
  };

  const handleOTPSubmit = (userId: string, resetPasswordToken: string) => {
    setInfoForgotPassword({
      userId,
      resetPasswordToken,
    });
    setIsOtpDiaLogOpen(false);
    setIsOpenForgotPassword(true);
  };

  return (
    <>
      {/* Login Form */}
      <div className="flex flex-col gap-2">
        <Card className="mx-auto max-w-sm bg-transparent border-none">
          <CardHeader>
            <CardTitle className="text-4xl">Login</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          className={`border-[#a996f6] ${
                            form.formState.errors.email ? 'border-red-500' : ''
                          } focus:outline-none focus-visible:outline-none focus-visible:ring-0`}
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <div
                          className="ml-auto inline-block text-sm underline cursor-pointer"
                          onClick={() => handleOpenForgetPasswordDialog()}
                        >
                          Forgot your password?
                        </div>
                      </div>
                      <FormControl>
                        <Input
                          className={`border-[#a996f6] ${
                            form.formState.errors.password ? 'border-red-500' : ''
                          } focus:outline-none focus-visible:outline-none focus-visible:ring-0`}
                          id="password"
                          type="password"
                          placeholder="********"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </Form>

            {/* Social Login Buttons */}
            <div className="flex items-center w-full gap-x-2 mt-2">
              <GoogleButton isLoading={isLoading} />
            </div>

            {/* Sign-up Link */}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OTP Dialog */}
      {/* <OtpDialog
        isOpen={isShowOtpDialog}
        onClose={() => setIsShowOtpDialog(false)}
        email={verificationEmail}
      /> */}

      <SendOTPDialog
        isOpen={isShowForgotPasswordDialog}
        onClose={() => setIsShowForgotPasswordDialog(false)}
        onSuccess={handleEmailSubmit}
      />

      <ConfirmOTPDialog
        email={forgotPasswordEmail}
        isOpen={isOtpDialogOpen}
        onClose={() => setIsOtpDiaLogOpen(false)}
        onSuccess={handleOTPSubmit}
      />

      <ResetPasswordDialog
        infoForgotPassword={infoForgotPassword}
        isOpen={isOpenForgotPassword}
        onClose={() => setIsOpenForgotPassword(false)}
      />
    </>
  );
}
