import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface FormButtonProps {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    processing?: boolean;
    children: ReactNode;
    loadingText?: string;
    icon?: LucideIcon;
    className?: string;
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    tabIndex?: number;
    'data-test'?: string;
}

export function FormButton({
    type = 'submit',
    disabled,
    processing = false,
    children,
    loadingText,
    icon: IconComponent,
    className = 'w-full',
    size = 'lg',
    variant = 'default',
    tabIndex,
    'data-test': dataTest,
}: FormButtonProps) {
    const isDisabled = disabled || processing;

    return (
        <Button
            type={type}
            className={className}
            size={size}
            variant={variant}
            disabled={isDisabled}
            tabIndex={tabIndex}
            data-test={dataTest}
        >
            {processing ? (
                <>
                    <Spinner />
                    {loadingText || 'Processing...'}
                </>
            ) : (
                <>
                    {IconComponent && (
                        <IconComponent className="mr-2 h-4 w-4" />
                    )}
                    {children}
                </>
            )}
        </Button>
    );
}

