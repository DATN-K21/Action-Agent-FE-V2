import { Button } from '@/components/ui/button'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import React, { useState } from 'react'
import {
  confirmResetPasswordOTP,
  IConfirmResetPasswordOTPResponse,
  sendResetPasswordOTP,
} from '@/services/auth-service'
import { toast } from '@/components/toast'
import { Icons } from '@/components/icon'

interface ConfirmOTPProps {
  email: string
  isOpen: boolean
  onClose: () => void
  onSuccess: (userId: string, resetPasswordToken: string) => void
}

const ConfirmOTPDialog: React.FC<ConfirmOTPProps> = ({
  email,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [resetPasswordOTP, setResetPasswordOTP] = useState<string>('')
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleReSendOTP = async () => {
    try {
      setIsResendDisabled(true)
      await sendResetPasswordOTP(email)

      // Enable resend button after 30 seconds
      setTimeout(() => {
        setIsResendDisabled(false)
      }, 30000) // 30 seconds

      toast({
        type: 'success',
        description: 'Resend OTP successfully - Please check your email',
      })
    } catch (error: any) {
      const errorReponse: IResponse<null> = error
      toast({
        type: 'error',
        description: errorReponse.message || 'Failed to resend OTP',
      })
    }
  }

  const handleChangeOTP = (value: string) => {
    if (!isNaN(Number(value))) {
      setResetPasswordOTP(value)
    }
  }

  const handleConfirmOTP = async () => {
    setIsLoading(true)

    try {
      const response: IResponse<IConfirmResetPasswordOTPResponse> =
        await confirmResetPasswordOTP(email, resetPasswordOTP)

      toast({
        type: 'success',
        description: response.message,
      })

      const { userId, resetPasswordToken } =
        response.data as IConfirmResetPasswordOTPResponse
      onSuccess(userId, resetPasswordToken)
    } catch (error: any) {
      const errorReponse: IResponse<null> = error
      toast({
        type: 'error',
        description: errorReponse.message,
      })
    } finally {
      setIsLoading(false)
      setResetPasswordOTP('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[90%] w-full p-5 sm:p-6">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl">Enter OTP</DialogTitle>
          <DialogDescription className="text-sm">
            Please enter the 6-digit OTP sent to your email.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4 gap-3">
          <div className="text-xs text-center text-muted-foreground mb-2">
            We have sent a verification code to<br />
            <span className="font-medium text-foreground">{email}</span>
          </div>

          <div className="w-full flex justify-center">
            <InputOTP
              maxLength={6}
              onChange={handleChangeOTP}
              value={resetPasswordOTP}
              disabled={isLoading}
              className="flex-wrap justify-center gap-2"
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="size-9 sm:size-10" />
                <InputOTPSlot index={1} className="size-9 sm:size-10" />
                <InputOTPSlot index={2} className="size-9 sm:size-10" />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-1" />
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={3} className="size-9 sm:size-10" />
                <InputOTPSlot index={4} className="size-9 sm:size-10" />
                <InputOTPSlot index={5} className="size-9 sm:size-10" />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <DialogFooter className="sm:flex-row flex-col gap-2 sm:gap-0">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end w-full gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReSendOTP}
              disabled={isResendDisabled || isLoading}
              className="w-full sm:w-auto"
            >
              {isResendDisabled ? "Resend in 30s" : "Resend OTP"}
            </Button>

            <Button
              type="button"
              onClick={handleConfirmOTP}
              disabled={resetPasswordOTP.length !== 6 || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
              Verify OTP
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmOTPDialog;