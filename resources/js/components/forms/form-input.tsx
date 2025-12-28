import InputError from '@/components/input-error';
import { Icon } from '@/components/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface FormInputProps {
    id: string;
    name: string;
    label: string;
    type?: string;
    icon?: LucideIcon;
    placeholder?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    required?: boolean;
    readOnly?: boolean;
    value?: string;
    defaultValue?: string;
    className?: string;
    error?: string;
    helperText?: ReactNode;
    tabIndex?: number;
    inputRef?: React.RefObject<HTMLInputElement>;
}

export function FormInput({
    id,
    name,
    label,
    type = 'text',
    icon: IconComponent,
    placeholder,
    autoComplete,
    autoFocus,
    required,
    readOnly,
    value,
    defaultValue,
    className = '',
    error,
    helperText,
    tabIndex,
    inputRef,
}: FormInputProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                {IconComponent && (
                    <Icon
                        iconNode={IconComponent}
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                )}
                <Input
                    id={id}
                    ref={inputRef}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    required={required}
                    readOnly={readOnly}
                    value={value}
                    defaultValue={defaultValue}
                    className={IconComponent ? 'pl-9' : ''}
                    tabIndex={tabIndex}
                />
            </div>
            {helperText && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
            <InputError message={error} />
        </div>
    );
}

