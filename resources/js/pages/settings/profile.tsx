import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, Mail, User } from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import { Icon } from '@/components/icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import ShopLayout from '@/layouts/app/shop-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit, update } from '@/routes/profile';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const page = usePage<SharedData>();
    const isAdmin =
        page.props.auth.user?.roles?.includes('SUPER_ADMIN') ||
        page.props.auth.user?.roles?.includes('ADMIN');
    const Layout = isAdmin ? AppLayout : ShopLayout;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Profile settings',
            href: edit().url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Icon
                                    iconNode={User}
                                    className="h-5 w-5 text-primary"
                                />
                            </div>
                            <div>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your name and email address
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
                            className="space-y-8"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="mb-4 text-sm font-medium text-foreground">
                                                    Personal Information
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">
                                                            Name
                                                        </Label>
                                                        <div className="relative">
                                                            <Icon
                                                                iconNode={User}
                                                                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                            />
                                                            <Input
                                                                id="name"
                                                                className="pl-9"
                                                                defaultValue={
                                                                    page.props
                                                                        .auth
                                                                        .user
                                                                        ?.name
                                                                }
                                                                name="name"
                                                                required
                                                                autoComplete="name"
                                                                placeholder="Full name"
                                                            />
                                                        </div>
                                                        <InputError
                                                            message={
                                                                errors.name
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">
                                                            Email address
                                                        </Label>
                                                        <div className="relative">
                                                            <Icon
                                                                iconNode={Mail}
                                                                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                            />
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                className="pl-9"
                                                                defaultValue={
                                                                    page.props
                                                                        .auth
                                                                        .user
                                                                        ?.email
                                                                }
                                                                name="email"
                                                                required
                                                                autoComplete="username"
                                                                placeholder="Email address"
                                                            />
                                                        </div>
                                                        <InputError
                                                            message={
                                                                errors.email
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {mustVerifyEmail &&
                                        page.props.auth.user
                                            ?.email_verified_at === null && (
                                            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                                                <p className="text-sm text-amber-900 dark:text-amber-100">
                                                    Your email address is
                                                    unverified.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="font-medium underline underline-offset-4 transition-colors hover:text-amber-950 dark:hover:text-amber-50"
                                                    >
                                                        Click here to resend the
                                                        verification email.
                                                    </Link>
                                                </p>

                                                {status ===
                                                    'verification-link-sent' && (
                                                    <div className="mt-3 flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        A new verification link
                                                        has been sent to your
                                                        email address.
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    <Separator />

                                    <CardFooter className="flex items-center justify-between gap-4 px-0 pb-0">
                                        <div className="flex items-center gap-4">
                                            <Button
                                                disabled={processing}
                                                data-test="update-profile-button"
                                                className="min-w-[120px]"
                                            >
                                                {processing
                                                    ? 'Saving...'
                                                    : 'Save changes'}
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
                                                    Changes saved
                                                </div>
                                            </Transition>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Your changes are saved automatically
                                        </p>
                                    </CardFooter>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <DeleteUser />
            </SettingsLayout>
        </Layout>
    );
}
