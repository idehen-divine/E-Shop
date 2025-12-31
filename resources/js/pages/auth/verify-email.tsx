import { Icon } from '@/components/icon';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';
import { CheckCircle2, LogOut, Mail, Send } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verify your email"
            description="We've sent a verification link to your email address. Please check your inbox and click the link to verify your account."
        >
            <Head title="Email verification" />

            <div className="space-y-6">
                {status === 'verification-link-sent' && (
                    <div className="-mt-2 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50/50 p-3 text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        <span>
                            A new verification link has been sent to the email
                            address you provided during registration.
                        </span>
                    </div>
                )}

                <div className="flex flex-col items-center gap-4 rounded-lg border bg-muted/50 p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon
                            iconNode={Mail}
                            className="h-6 w-6 text-primary"
                        />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            Check your email inbox
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Click the verification link in the email we sent you
                            to complete your account setup
                        </p>
                    </div>
                </div>

                <Form {...send.form()} className="space-y-4">
                    {({ processing }) => (
                        <>
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                variant="secondary"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Resend verification email
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </Form>

                <Separator />

                <div className="text-center">
                    <TextLink href={logout()} className="text-sm font-medium">
                        <Icon
                            iconNode={LogOut}
                            className="mr-1 inline h-3 w-3"
                        />
                        Sign out
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
