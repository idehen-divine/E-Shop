import { Icon } from '@/components/icon';
import {
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface SettingsCardHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
    badge?: ReactNode;
}

export function SettingsCardHeader({
    icon: IconComponent,
    title,
    description,
    badge,
}: SettingsCardHeaderProps) {
    return (
        <CardHeader>
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon
                        iconNode={IconComponent}
                        className="h-5 w-5 text-primary"
                    />
                </div>
                <div className={badge ? 'flex-1' : ''}>
                    <div className={badge ? 'flex items-center gap-3' : ''}>
                        <CardTitle>{title}</CardTitle>
                        {badge && <div className="ml-auto">{badge}</div>}
                    </div>
                    <CardDescription>{description}</CardDescription>
                </div>
            </div>
        </CardHeader>
    );
}

