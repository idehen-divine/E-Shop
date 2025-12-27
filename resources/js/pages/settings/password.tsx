import InputError from '@/components/input-error';
import { Icon } from '@/components/icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import ShopLayout from '@/layouts/app/shop-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import { CheckCircle2, Lock, KeyRound } from 'lucide-react';
import { useRef } from 'react';
import { edit, update } from '@/routes/user-password';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const page = usePage<SharedData>();
    const isAdmin =
        page.props.auth.user?.roles?.includes('SUPER_ADMIN') ||
        page.props.auth.user?.roles?.includes('ADMIN');
    const Layout = isAdmin ? AppLayout : ShopLayout;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Password settings',
            href: edit().url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Icon
                                    iconNode={Lock}
                                    className="h-5 w-5 text-primary"
                                />
                            </div>
                            <div>
                                <CardTitle>Update Password</CardTitle>
                                <CardDescription>
                                    Ensure your account is using a long, random
                                    password to stay secure
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Form
                            action={update().url}
                            method={update().method}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            className="space-y-8"
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="mb-4 text-sm font-medium text-foreground">
                                                    Change Password
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="current_password">
                                                            Current password
                                                        </Label>
                                                        <div className="relative">
                                                            <Icon
                                                                iconNode={KeyRound}
                                                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                            />
                                                            <Input
                                                                id="current_password"
                                                                ref={currentPasswordInput}
                                                                name="current_password"
                                                                type="password"
                                                                className="pl-9"
                                                                autoComplete="current-password"
                                                                placeholder="Enter your current password"
                                                            />
                                                        </div>
                                                        <InputError
                                                            message={
                                                                errors.current_password
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="password">
                                                            New password
                                                        </Label>
                                                        <div className="relative">
                                                            <Icon
                                                                iconNode={Lock}
                                                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                            />
                                                            <Input
                                                                id="password"
                                                                ref={passwordInput}
                                                                name="password"
                                                                type="password"
                                                                className="pl-9"
                                                                autoComplete="new-password"
                                                                placeholder="Enter your new password"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Use at least 8 characters with a mix of
                                                            letters, numbers, and symbols
                                                        </p>
                                                        <InputError
                                                            message={errors.password}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="password_confirmation">
                                                            Confirm password
                                                        </Label>
                                                        <div className="relative">
                                                            <Icon
                                                                iconNode={Lock}
                                                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                            />
                                                            <Input
                                                                id="password_confirmation"
                                                                name="password_confirmation"
                                                                type="password"
                                                                className="pl-9"
                                                                autoComplete="new-password"
                                                                placeholder="Confirm your new password"
                                                            />
                                                        </div>
                                                        <InputError
                                                            message={
                                                                errors.password_confirmation
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <CardFooter className="flex items-center justify-between gap-4 px-0 pb-0">
                                        <div className="flex items-center gap-4">
                                            <Button
                                                disabled={processing}
                                                data-test="update-password-button"
                                                className="min-w-[140px]"
                                            >
                                                {processing
                                                    ? 'Updating...'
                                                    : 'Update password'}
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
                                                    Password updated
                                                </div>
                                            </Transition>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Make sure to save your password securely
                                        </p>
                                    </CardFooter>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </SettingsLayout>
        </Layout>
    );
}
