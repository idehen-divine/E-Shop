import { Button } from '@/components/ui/button';
import {
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        icon?: LucideIcon;
        onClick: () => void;
    };
}

export function PageHeader({
    icon: Icon,
    title,
    description,
    action,
}: PageHeaderProps) {
    return (
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </div>
                {action && (
                    <Button onClick={action.onClick} className="gap-2">
                        {action.icon && <action.icon className="h-4 w-4" />}
                        {action.label}
                    </Button>
                )}
            </div>
        </CardHeader>
    );
}

