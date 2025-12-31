import {
    AuthLinkFooter,
    FormButton,
    FormInput,
    StatusAlert,
} from '@/components/forms';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AuthLayout
            title="Welcome back"
            description="Enter your credentials to access your account"
        >
            <Head title="Log in" />

            {status && <StatusAlert message={status} />}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            <FormInput
                                id="email"
                                name="email"
                                label="Email address"
                                type="email"
                                icon={Mail}
                                placeholder="email@example.com"
                                autoComplete="email"
                                autoFocus
                                required
                                tabIndex={1}
                                error={errors.email}
                            />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm font-medium"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <FormInput
                                    id="password"
                                    name="password"
                                    label=""
                                    type="password"
                                    icon={Lock}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    tabIndex={2}
                                    error={errors.password}
                                    className="!mt-0"
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm font-normal"
                                >
                                    Remember me for 30 days
                                </Label>
                            </div>
                        </div>

                        <FormButton
                            processing={processing}
                            loadingText="Signing in..."
                            icon={Lock}
                            tabIndex={4}
                            data-test="login-button"
                        >
                            Sign in
                        </FormButton>

                        {canRegister && (
                            <AuthLinkFooter
                                question="Don't have an account?"
                                linkText="Create an account"
                                href={register()}
                                tabIndex={5}
                            />
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
