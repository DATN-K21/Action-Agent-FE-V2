'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { loginSchema } from '@/validation-schemas/auth-schema'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/toast'
import { useState } from 'react'
import { Icons } from '@/components/icon'
import { signIn } from 'next-auth/react'
import {
  ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE,
  INVALID_LOGIN_ERROR_MESSAGE,
  Providers,
} from '@/constants/auth-constant'
import GoogleButton from './google-button'
import SendOTPDialog from './forgot-password/send-otp-dialog'
import ConfirmOTPDialog from './forgot-password/confirm-otp-dialog'
import ResetPasswordDialog from './forgot-password/reset-password-dialog'
import { sendAccountActivationEmail } from '@/services/auth-service'

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false)
  const [isOTPDialogOpen, setOTPDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setResetPasswordDialogOpen] =
    useState(false)

  const [forgotPasswordUserEmail, setForgotPasswordUserEmail] =
    useState<string>('')
  const [forgotPasswordInfo, setForgotPasswordInfo] = useState<{
    userId: string
    resetPasswordToken: string
  }>({
    userId: '',
    resetPasswordToken: '',
  })

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)

    // Sign in with credentials using NextAuth
    const result = await signIn(Providers.Credentials, {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    // Handle login result
    if (result?.code === INVALID_LOGIN_ERROR_MESSAGE) {
      // Credentials are invalid
      toast({ type: 'error', description: INVALID_LOGIN_ERROR_MESSAGE })
      form.setValue('password', '')
    } else if (result?.code === ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE) {
      // Account is not verified
      toast({
        type: 'error',
        description: ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE,
      })

      // Send verification email
      await sendAccountActivationEmail(data.email)

      form.reset()
    } else if (!result?.error) {
      // Login successful
      toast({ type: 'success', description: 'Login successful' })
      router.push('/')
    }

    setIsLoading(false)
  }

  // Handle after sending OTP successfully
  const handleSendOTPSucess = (email: string) => {
    setForgotPasswordUserEmail(email)
    setForgotPasswordDialogOpen(false)
    setOTPDialogOpen(true)
  }

  // Handle after verifying OTP successfully
  const handleVerifyOTPSucess = (
    userId: string,
    resetPasswordToken: string,
  ) => {
    setForgotPasswordInfo({ userId, resetPasswordToken })
    setOTPDialogOpen(false)
    setResetPasswordDialogOpen(true)
  }

  // Handle after resetting password successfully
  const handleResetPasswordSucess = () => {
    form.reset()
    setResetPasswordDialogOpen(false)
  }

  return (
    <>
      {/* Login Form */}
      <div className="flex flex-col gap-2">
        <Card className="mx-auto max-w-sm bg-white border border-gray-200 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-4xl">Login</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="grid gap-4"
              >
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
                          disabled={isLoading}
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
                          onClick={() => setForgotPasswordDialogOpen(true)}
                        >
                          Forgot your password?
                        </div>
                      </div>
                      <FormControl>
                        <Input
                          className={`border-[#a996f6] ${
                            form.formState.errors.password
                              ? 'border-red-500'
                              : ''
                          } focus:outline-none focus-visible:outline-none focus-visible:ring-0`}
                          id="password"
                          type="password"
                          placeholder="********"
                          required
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  )}
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
  )
}
