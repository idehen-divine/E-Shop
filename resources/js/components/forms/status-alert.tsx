import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { type ReactNode } from 'react';

type StatusType = 'success' | 'error' | 'warning' | 'info';

interface StatusAlertProps {
    type?: StatusType;
    message: ReactNode;
    className?: string;
}

const statusConfig: Record<
    StatusType,
    { icon: typeof CheckCircle2; classes: string }
> = {
    success: {
        icon: CheckCircle2,
        classes:
            'border-green-200 bg-green-50/50 text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400',
    },
    error: {
        icon: XCircle,
        classes:
            'border-red-200 bg-red-50/50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400',
    },
    warning: {
        icon: AlertCircle,
        classes:
            'border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400',
    },
    info: {
        icon: Info,
        classes:
            'border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-400',
    },
};

export function StatusAlert({
    type = 'success',
    message,
    className = '-mt-2 mb-6',
}: StatusAlertProps) {
    const config = statusConfig[type];
    const Icon = config.icon;

    return (
        <div
            className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium ${config.classes} ${className}`}
        >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
}
