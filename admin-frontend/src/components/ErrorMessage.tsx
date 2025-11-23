import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  error: string;
  onDismiss: () => void;
  className?: string;
}

export default function ErrorMessage({ error, onDismiss, className = '' }: ErrorBoundaryProps) {
  if (!error) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="ml-2 text-red-600 hover:text-red-800 hover:bg-red-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}