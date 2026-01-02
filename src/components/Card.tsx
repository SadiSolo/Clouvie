import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
}

export default function Card({ children, className = '', gradient }: CardProps) {
  if (gradient) {
    return (
      <div className={`rounded-2xl bg-gradient-to-r ${gradient} p-6 shadow-lg ${className}`}>
        {children}
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}
