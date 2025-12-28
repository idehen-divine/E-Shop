import { Icon } from '@/components/icon';
import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface InfoBoxProps {
    icon: LucideIcon;
    title?: string;
    description: ReactNode;
    variant?: 'default' | 'muted';
    className?: string;
}

export function InfoBox({
    icon: IconComponent,
    title,
    description,
    variant = 'muted',
    className = '',
}: InfoBoxProps) {
    const variantClasses =
        variant === 'muted'
            ? 'border bg-muted/50'
            : 'border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20';

    return (
        <div
            className={`flex flex-col items-center gap-3 rounded-lg p-4 text-center ${variantClasses} ${className}`}
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon
                    iconNode={IconComponent}
                    className="h-5 w-5 text-primary"
                />
            </div>
            {title && (
                <div className="space-y-1">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            )}
            {!title && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}

