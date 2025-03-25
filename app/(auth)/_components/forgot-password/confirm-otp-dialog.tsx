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
      <DialogContent className="max-w-[300px] md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogDescription>
            Please enter the 6-digit OTP sent to your email.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            onChange={handleChangeOTP}
            value={resetPasswordOTP}
            disabled={isLoading}
          >
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
            onClick={handleReSendOTP}
            disabled={isResendDisabled || isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Resend OTP
          </Button>
          <Button
            type="button"
            onClick={handleConfirmOTP}
            disabled={resetPasswordOTP.length !== 6 || isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmOTPDialog
