'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { IMCP } from '@/types/mcp';
import { Textarea } from '@/components/ui/textarea';

interface MCPServerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (server: any) => void;
  title: string;
  defaultValues?: IMCP;
  isSubmitting?: boolean;
}

export function MCPServerDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  defaultValues,
  isSubmitting = false,
}: MCPServerDialogProps) {
  const [formValues, setFormValues] = useState({
    id: defaultValues?.id || '',
    mcpName: defaultValues?.mcpName || '',
    url: defaultValues?.url || '',
    description: defaultValues?.description || '',
  });

  const [errors, setErrors] = useState({
    mcpName: '',
    url: '',
    description: '',
  });

  // Update form values when defaultValues changes
  useEffect(() => {
    if (defaultValues) {
      setFormValues({
        id: defaultValues.id,
        mcpName: defaultValues.mcpName,
        url: defaultValues.url,
        description: defaultValues.description || '',
      });
    } else {
      setFormValues({
        id: '',
        mcpName: '',
        url: '',
        description: '',
      });
    }
    // Reset errors when dialog opens/closes
    setErrors({ mcpName: '', url: '', description: '' });
  }, [defaultValues, isOpen]);

  // Handle form input and textarea changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = { mcpName: '', url: '', description: '' };

    if (!formValues.mcpName.trim()) {
      newErrors.mcpName = 'Server name is required';
      isValid = false;
    }

    if (!formValues.url.trim()) {
      newErrors.url = 'URL is required';
      isValid = false;
    } else {
      try {
        new URL(formValues.url);
      } catch (e) {
        newErrors.url = 'Please enter a valid URL';
        isValid = false;
      }
    }

    if (!formValues.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formValues);
    }
  };

  console.log('Form Values:', formValues);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95%] max-w-full mx-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription>Fill in the details of your MCP server below.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
              <Label htmlFor="mcpName" className="md:text-right">
                Name
              </Label>
              <div className="col-span-1 md:col-span-3 w-full">
                <Input
                  id="mcpName"
                  name="mcpName"
                  value={formValues.mcpName}
                  onChange={handleChange}
                  placeholder="Enter server name"
                  className={errors.mcpName ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.mcpName && <span className="text-sm text-red-500">{errors.mcpName}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
              <Label htmlFor="url" className="md:text-right">
                URL
              </Label>
              <div className="col-span-1 md:col-span-3 w-full">
                <Input
                  id="url"
                  name="url"
                  value={formValues.url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className={errors.url ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.url && <span className="text-sm text-red-500">{errors.url}</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 items-start md:items-center gap-2 md:gap-4">
              <Label htmlFor="description" className="md:text-right">
                Description
              </Label>
              <div className="col-span-1 md:col-span-3 w-full">
                <Textarea
                  id="description"
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  placeholder="Enter a brief description of the server"
                  className={errors.description ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <span className="text-sm text-red-500">{errors.description}</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
