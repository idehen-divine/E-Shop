import { Icon } from '@/components/icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';
import { Lock, Shield } from 'lucide-react';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area. Please confirm your password to continue."
        >
            <Head title="Confirm password" />

            <div className="space-y-6">
                <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/50 p-4 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon
                            iconNode={Shield}
                            className="h-5 w-5 text-primary"
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        For your security, please confirm your password to
                        access this page
                    </p>
                </div>

                <Form {...store.form()} resetOnSuccess={['password']}>
                    {({ processing, errors }) => (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Icon
                                        iconNode={Lock}
                                        className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="pl-9"
                                        autoFocus
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="mr-2 h-4 w-4" />
                                        Confirm password
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
