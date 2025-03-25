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
import { useForm } from 'react-hook-form';
import { resetPasswordSchema } from '@/validation-schemas/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/services/auth-service';
import { toast } from '@/components/toast';
import { Icons } from '@/components/icon';

interface ResetPasswordProps {
  forgotPasswordInfo: { userId: string; resetPasswordToken: string };
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordDialog: React.FC<ResetPasswordProps> = ({
  forgotPasswordInfo,
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      newConfirmPassword: '',
    },
  });

  // Handle reset password
  const handleSubmit = async (data: { newPassword: string; newConfirmPassword: string }) => {
    setIsLoading(true);

    try {
      const response = await resetPassword({
        newPassword: data.newPassword,
        newConfirmPassword: data.newConfirmPassword,
        forgotPasswordInfo,
      });

      toast({
        type: 'success',
        description: response.message,
      });

      onClose();
    } catch (error: any) {
      const errorResponse: IResponse<null> = error;

      toast({
        type: 'error',
        description: errorResponse.message || 'Failed to reset password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[90%] w-full p-5 sm:p-6">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl">Reset Password</DialogTitle>
          <DialogDescription className="text-sm">
            Please enter a new password for your account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-2">
            {/* Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel htmlFor="newPassword" className="text-sm font-medium">New Password</FormLabel>
                  <FormControl>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="********"
                      required
                      disabled={isLoading}
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="newConfirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel htmlFor="newConfirmPassword" className="text-sm font-medium">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      id="newConfirmPassword"
                      type="password"
                      placeholder="********"
                      required
                      disabled={isLoading}
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:flex-row flex-col gap-2 sm:gap-0 mt-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto order-2 sm:order-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto order-1 sm:order-2"
                disabled={isLoading}
              >
                {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
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