import { Icon } from '@/components/icon';
import TextLink from '@/components/text-link';
import { Separator } from '@/components/ui/separator';
import { type LucideIcon } from 'lucide-react';

interface AuthLinkFooterProps {
    question: string;
    linkText: string;
    href: string;
    icon?: LucideIcon;
    showSeparator?: boolean;
    className?: string;
}

export function AuthLinkFooter({
    question,
    linkText,
    href,
    icon: IconComponent,
    showSeparator = true,
    className = '',
    tabIndex,
}: AuthLinkFooterProps) {
    return (
        <>
            {showSeparator && <Separator />}
            <div className={`text-center text-sm ${className}`}>
                {question && (
                    <span className="text-muted-foreground">{question} </span>
                )}
                <TextLink
                    href={href}
                    className="font-medium"
                    tabIndex={tabIndex}
                >
                    {IconComponent && (
                        <Icon
                            iconNode={IconComponent}
                            className="mr-1 inline h-3 w-3"
                        />
                    )}
                    {linkText}
                </TextLink>
            </div>
        </>
    );
}
