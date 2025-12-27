import { login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Mail, Send } from 'lucide-react';

import InputError from '@/components/input-error';
import { Icon } from '@/components/icon';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Reset your password"
            description="Enter your email address and we'll send you a link to reset your password"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="-mt-2 mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50/50 p-3 text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>{status}</span>
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative">
                                    <Icon
                                        iconNode={Mail}
                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        placeholder="email@example.com"
                                        className="pl-9"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    We'll send a password reset link to this
                                    email address
                                </p>
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        Sending reset link...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send reset link
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </Form>

                <Separator />

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                        Remember your password?{' '}
                    </span>
                    <TextLink href={login()} className="font-medium">
                        <Icon
                            iconNode={ArrowLeft}
                            className="mr-1 inline h-3 w-3"
                        />
                        Back to sign in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
