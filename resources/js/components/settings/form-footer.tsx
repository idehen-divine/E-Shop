import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Transition } from '@headlessui/react';
import { CheckCircle2 } from 'lucide-react';

interface FormFooterProps {
    processing: boolean;
    recentlySuccessful: boolean;
    buttonText: string;
    loadingText?: string;
    successText?: string;
    helperText?: string;
    buttonClassName?: string;
    'data-test'?: string;
}

export function FormFooter({
    processing,
    recentlySuccessful,
    buttonText,
    loadingText,
    successText = 'Changes saved',
    helperText,
    buttonClassName = 'min-w-[120px]',
    'data-test': dataTest,
}: FormFooterProps) {
    return (
        <CardFooter className="flex items-center justify-between gap-4 px-0 pb-0">
            <div className="flex items-center gap-4">
                <Button
                    type="submit"
                    disabled={processing}
                    className={buttonClassName}
                    data-test={dataTest}
                >
                    {processing ? loadingText || 'Saving...' : buttonText}
                </Button>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out duration-200"
                    enterFrom="opacity-0 scale-95 translate-x-2"
                    enterTo="opacity-100 scale-100 translate-x-0"
                    leave="transition ease-in-out duration-150"
                    leaveFrom="opacity-100 scale-100 translate-x-0"
                    leaveTo="opacity-0 scale-95 translate-x-2"
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        {successText}
                    </div>
                </Transition>
            </div>
            {helperText && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
        </CardFooter>
    );
}
