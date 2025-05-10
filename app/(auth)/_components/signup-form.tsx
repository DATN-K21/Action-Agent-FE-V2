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
import { Icons } from '@/components/icon';
import { useRouter } from 'next/navigation';
import { register, sendAccountActivationEmail } from '@/services/auth-service';
import { toast } from '@/components/toast';

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleRegister = async (data: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = data;
      await register(dataToSend);
      await sendAccountActivationEmail(data.email);

      toast({
        type: 'success',
        description: 'Please check your email for verification.',
      });

      form.reset();
      router.push('/login');
    } catch (error: any) {
      const errorReponse: IResponse<null> = error;
      toast({
        type: 'error',
        description: errorReponse.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center py-4">
          <CardTitle className="text-xl">Hey there! Welcome to Action Agent</CardTitle>
          <CardDescription>Let’s set up your account in just a few steps</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-3">
              <div className="grid gap-3">
                <div className="flex flex-col gap-2">
                  <GoogleButton isLoading={isLoading} />
                </div>

                <div className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>

                <div className="grid gap-2">
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-0.5">
                        <FormLabel htmlFor="email" className="text-sm">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            disabled={isLoading}
                            className="h-8"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  {/* Username Field */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-0.5">
                        <FormLabel htmlFor="username" className="text-sm">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="username"
                            type="text"
                            placeholder="johndoe"
                            disabled={isLoading}
                            className="h-8"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  {/* Name Fields Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="space-y-0.5">
                          <FormLabel htmlFor="firstName" className="text-sm">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="firstName"
                              type="text"
                              placeholder="John"
                              disabled={isLoading}
                              className="h-8"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="space-y-0.5">
                          <FormLabel htmlFor="lastName" className="text-sm">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="lastName"
                              type="text"
                              placeholder="Doe"
                              disabled={isLoading}
                              className="h-8"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-0.5">
                        <FormLabel htmlFor="password" className="text-sm">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="********"
                            disabled={isLoading}
                            className="h-8"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-0.5">
                        <FormLabel htmlFor="confirmPassword" className="text-sm">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="********"
                            disabled={isLoading}
                            className="h-8"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button type="submit" className="w-full h-8 mt-1" disabled={isLoading}>
                    {isLoading && <Icons.spinner className="mr-2 size-3 animate-spin" />}
                    Create account
                  </Button>

                  <div className="text-center text-xs mt-1">
                    Already have an account?{' '}
                    <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                      Login
                    </Link>
                  </div>
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
  );
}
