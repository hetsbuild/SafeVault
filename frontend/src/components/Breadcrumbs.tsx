import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  onBack?: () => void;
  backLabel?: string;
}

export default function Breadcrumbs({ items, onBack, backLabel = "Back" }: BreadcrumbsProps) {
  if (!items.length && !onBack) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 mb-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300
            bg-white text-gray-700 text-sm font-medium hover:bg-gray-50
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {backLabel}
        </button>
      )}

      {onBack && items.length > 0 && (
        <span className="hidden sm:block text-gray-300 select-none" aria-hidden="true">
          |
        </span>
      )}

      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight size={14} className="text-gray-300 shrink-0" aria-hidden="true" />
              )}

              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="text-indigo-600 hover:text-indigo-800 hover:underline
                    rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-gray-900 font-semibold truncate max-w-[16rem]"
                  aria-current={isLast ? "page" : undefined}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}