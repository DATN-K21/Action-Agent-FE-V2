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
import { registerSchema } from '@/validation-schemas/auth-schema';
import { useState } from 'react';
import GoogleButton from './google-button';
// import { ApiResponse } from '@/types';
import { Icons } from '@/components/icon';
//import OtpDialog from '@/app/(auth)/_components/otp-dialog';
import { useRouter } from 'next/navigation';
import { Register, SendLink } from '@/services/auth-service';
import { toast } from '@/components/toast';
import { IRegisterReponse } from '@/types/auth';

export function SignUpForm() {
  const router = useRouter();
  const [verificationEmail, setVerificationEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState<boolean>(false);
  //const { toast } = useToast();
  // Use react-hook-form with validation and initial default values
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    setVerificationEmail(data.email);

    try {
      const { confirmPassword, ...dataToSend } = data;

      const response: IResponse<IRegisterReponse> = await Register(dataToSend);

      if (response.status === 200 || response.status === 201) {
        // toast({
        //   variant: 'success',
        //   title: 'Success',
        //   description: 'Please check your email for verification.',
        // });

        toast({
          type: 'success',
          description: 'Please check your email for verification.',
        });

        // Clear the form
        form.reset();

        const { email } = data;

        await SendLink(email);

        router.push('/login');
      } else {
        toast({
          type: 'error',
          description: response.message,
        });
      }
    } catch (error: any) {
      const errorReponse: IResponse<null> = error?.json || {};
      toast({
        type: 'error',
        description: errorReponse.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="mx-auto max-w-sm bg-white border border-gray-200 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-4xl">Create account</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to create your account!
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
                        className="border-[#a996f6] focus:outline-none focus-visible:outline-none focus-visible:ring-0"
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

              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#a996f6] focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#a996f6] focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                          id="firstName"
                          type="text"
                          placeholder="John"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="lastName">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          className="border-[#a996f6] focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel htmlFor="password">Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        className="border-[#a996f6] focus:outline-none focus-visible:outline-none focus-visible:ring-0"
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

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        className="border-[#a996f6] focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                        id="confirmPassword"
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
                {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
                Create your account
              </Button>
            </form>
          </Form>

          {/* Social Login Buttons */}
          <div className="flex items-center w-full gap-x-2 mt-2">
            <GoogleButton isLoading={isLoading} />
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
