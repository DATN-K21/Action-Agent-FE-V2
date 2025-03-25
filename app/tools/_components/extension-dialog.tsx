import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icon'
import { useToast } from '@/hooks/use-toast'

const features = [
  {
    title: 'Send email',
    description: 'You can send an email to other users.',
  },
  {
    title: 'Delete email',
    description: 'You can delete an email.',
  },
  {
    title: 'Mark email as read',
    description: 'You can mark an email as read.',
  },
]

interface ExtensionDialogProps {
  isOpen: boolean
  onClose: () => void
}

const ExtensionDialog: React.FC<ExtensionDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleClickConnect = () => {
    setIsConnecting(true)
    try {
      setTimeout(() => {
        onClose()
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Gmail connected successfully!',
        })
      }, 2000)
    } catch (error) {
    } finally {
      setTimeout(() => {
        setIsConnecting(false)
      }, 2000)
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[300px] md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Gmail </DialogTitle>
          <DialogDescription>
            Integare your Gmail account with Botion.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Card className="w-full md:w-[380px]">
            <CardContent className="grid gap-4 p-4">
              <div>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex size-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {feature.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleClickConnect}
            disabled={isConnecting}
          >
            {isConnecting && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExtensionDialog
