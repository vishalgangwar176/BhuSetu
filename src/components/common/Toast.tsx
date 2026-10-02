import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
    info: 'border-teal-200 bg-teal-50/95 text-teal-900',
    warning: 'border-amber-200 bg-amber-50/95 text-amber-900',
    error: 'border-rose-200 bg-rose-50/95 text-rose-900'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${borders[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-sm font-semibold tracking-tight leading-none mb-1">{toast.title}</p>
          <p className="text-xs opacity-90 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1 -mr-1 -mt-1"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
