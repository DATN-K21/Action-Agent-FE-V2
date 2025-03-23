import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { forgotPasswordSchema } from '@/validation-schemas/otp-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { ResetPassword } from '@/services/auth-service';
import { toast } from '@/components/toast';

interface ResetPasswordProps {
  infoForgotPassword: { userId: string; resetPasswordToken: string };
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordDialog: React.FC<ResetPasswordProps> = ({
  infoForgotPassword,
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: { password: string; confirmPassword: string }) => {
    setIsLoading(true);

    try {
      const response = await ResetPassword({
        newPassword: data.password,
        confirmNewPassword: data.confirmPassword,
        infoForgotPassword,
      });

      if (response.status === 200) {
        toast({
          type: 'success',
          description: response.message,
        });

        onClose();
      }
    } catch (error: any) {
      const errorResponse: IResponse<null> = error || {};
      toast({
        type: 'error',
        description: errorResponse.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
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
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
