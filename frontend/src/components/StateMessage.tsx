import type { LucideIcon } from "lucide-react";

interface StateMessageProps {
  icon: LucideIcon;
  title: string;
  message?: string;
  onRetry?: () => void;
}

export default function StateMessage({ icon: Icon, title, message, onRetry }: StateMessageProps) {
  return (
    <div className="text-center py-20 text-gray-400" role="status">
      <Icon size={40} className="mx-auto mb-3" aria-hidden="true" />
      <p className="text-lg font-medium">{title}</p>
      {message && <p className="text-sm mt-1">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}