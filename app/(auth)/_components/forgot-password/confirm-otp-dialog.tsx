import { Button } from '@/components/ui/button';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import React, { useState } from 'react';
import { ConfirmOTP, SendOTP } from '@/services/auth-service';
import { toast } from '@/components/toast';

interface ConfirmOTPProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string, resetPasswordToken: string) => void;
}

const ConfirmOTPDialog: React.FC<ConfirmOTPProps> = ({ email, isOpen, onClose, onSuccess }) => {
  const [otp, setOtp] = useState<string>('');
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendOtp = async () => {
    try {
      setIsResendDisabled(true);
      const response = await SendOTP(email);

      // Enable resend button after 30 seconds
      setTimeout(() => {
        setIsResendDisabled(false);
      }, 30000); // 30 seconds

      if (response.status === 200) {
        toast({
          type: 'success',
          description: 'Resend OTP successfully - Please check your email',
        });
      }
    } catch (error: any) {
      const errorReponse: IResponse<null> = error || {};
      toast({
        type: 'error',
        description: errorReponse.message,
      });
    }
  };

  const handleChange = (value: string) => {
    if (!isNaN(Number(value))) {
      setOtp(value);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await ConfirmOTP(email, otp);

      if (response.status === 200) {
        toast({
          type: 'success',
          description: response.message,
        });
      }

      if (response.data?.userId && response.data?.resetPasswordToken) {
        onSuccess(response.data.userId, response.data.resetPasswordToken);
      }
    } catch (error: any) {
      const errorReponse: IResponse<null> = error || {};
      toast({
        type: 'error',
        description: errorReponse.message,
      });
    } finally {
      setIsLoading(false);
      setOtp('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[300px] md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogDescription>Please enter the 6-digit OTP sent to your email.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <InputOTP maxLength={6} onChange={handleChange} value={otp} disabled={isLoading}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant={'outline'}
            onClick={sendOtp}
            disabled={isResendDisabled || isLoading}
          >
            Resend OTP
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={otp.length !== 6 || isLoading}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmOTPDialog;
