import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { resetPasswordSchema } from '@/validation-schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { resetPassword } from '@/services/auth-service'
import { toast } from '@/components/toast'
import { Icons } from '@/components/icon'

interface ResetPasswordProps {
  forgotPasswordInfo: { userId: string; resetPasswordToken: string }
  isOpen: boolean
  onClose: () => void
}

const ResetPasswordDialog: React.FC<ResetPasswordProps> = ({
  forgotPasswordInfo,
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      newConfirmPassword: '',
    },
  })

  // Handle reset password
  const handleSubmit = async (data: {
    newPassword: string
    newConfirmPassword: string
  }) => {
    setIsLoading(true)

    try {
      const response = await resetPassword({
        newPassword: data.newPassword,
        newConfirmPassword: data.newConfirmPassword,
        forgotPasswordInfo,
      })

      toast({
        type: 'success',
        description: response.message,
      })

      onClose()
    } catch (error: any) {
      const errorResponse: IResponse<null> = error

      toast({
        type: 'error',
        description: errorResponse.message || 'Failed to reset password',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[300px] md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter new Password</DialogTitle>
          <DialogDescription>
            Please enter your new password to reset your password.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4"
          >
            {/* Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      className="border-[#a996f6] focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                      id="newPassword"
                      type="password"
                      placeholder="********"
                      required
                      disabled={isLoading}
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
              name="newConfirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      className="border-[#a996f6] focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                      id="newConfirmPassword"
                      type="password"
                      placeholder="********"
                      required
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordDialog
