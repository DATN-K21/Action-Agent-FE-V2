'use client';

import React, { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
import { CheckCircleFillIcon, WarningIcon } from './icons';
import { InfoIcon } from 'lucide-react';

const iconsByType: Record<'infor' | 'success' | 'error', ReactNode> = {
  infor: <InfoIcon />,
  success: <CheckCircleFillIcon />,
  error: <WarningIcon />,
};

export function toast(props: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <Toast id={id} type={props.type} description={props.description} />
  ));
}

function Toast(props: ToastProps) {
  const { id, type, description } = props;

  return (
    <div className="flex w-full toast-mobile:w-[356px] justify-center shadow-none">
      <div
        data-testid="toast"
        key={id}
        className="bg-zinc-100 p-3 rounded-lg toast-mobile:w-fit flex flex-row gap-4 items-center"
      >
        <div
          data-type={type}
          className="data-[type=info]:text-zinc-900 data-[type=error]:text-red-600 data-[type=success]:text-green-600"
        >
          {iconsByType[type]}
        </div>
        <div className="text-zinc-950 text-sm">{description}</div>
      </div>
    </div>
  );
}

interface ToastProps {
  id: string | number;
  type: 'infor' | 'success' | 'error';
  description: string;
  duration?: number;
}
