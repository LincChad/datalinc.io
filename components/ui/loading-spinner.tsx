'use client';

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function LoadingSpinner({ size = 16, className }: LoadingSpinnerProps) {
  return (  
    <Loader2
      className={cn("animate-spin", className)}
      size={size}
    />
  );
} 