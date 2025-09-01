'use client';

import { CheckCircle2, Zap } from 'lucide-react';

interface TaskFlowLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function TaskFlowLogo({ size = 'md', showText = true }: TaskFlowLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} taskflow-gradient rounded-xl flex items-center justify-center shadow-lg`}>
          <CheckCircle2 className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-7 w-7'} text-white`} />
        </div>
        <Zap className={`absolute -top-1 -right-1 ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} text-yellow-400 drop-shadow-sm`} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent`}>
            TaskFlow
          </h1>
          {size === 'lg' && (
            <p className="text-sm text-muted-foreground -mt-1">
              Flua com sua produtividade
            </p>
          )}
        </div>
      )}
    </div>
  );
}