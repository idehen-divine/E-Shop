import { Icon } from '@/components/icon';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import ShopLayout from '@/layouts/app/shop-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';
import { Shield, ShieldAlert, ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const page = usePage<SharedData>();
    const isAdmin =
        page.props.auth.user?.roles?.includes('SUPER_ADMIN') ||
        page.props.auth.user?.roles?.includes('ADMIN');
    const Layout = isAdmin ? AppLayout : ShopLayout;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Two-Factor Authentication',
            href: show.url(),
        },
    ];
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Two-Factor Authentication" />
            <SettingsLayout>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Icon
                                    iconNode={Shield}
                                    className="h-5 w-5 text-primary"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <CardTitle>
                                        Two-Factor Authentication
                                    </CardTitle>
                                    <Badge
                                        variant={
                                            twoFactorEnabled
                                                ? 'default'
                                                : 'destructive'
                                        }
                                        className="ml-auto"
                                    >
                                        {twoFactorEnabled
                                            ? 'Enabled'
                                            : 'Disabled'}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Add an extra layer of security to your
                                    account
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            {twoFactorEnabled ? (
                                <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
                                    <div className="flex items-start gap-3">
                                        <Icon
                                            iconNode={ShieldCheck}
                                            className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                                Two-factor authentication is
                                                enabled
                                            </p>
                                            <p className="mt-1.5 text-sm leading-relaxed text-green-800 dark:text-green-200">
                                                You will be prompted for a
                                                secure, random pin during login,
                                                which you can retrieve from a
                                                TOTP-supported application on
                                                your phone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                                    <div className="flex items-start gap-3">
                                        <Icon
                                            iconNode={ShieldAlert}
                                            className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                                Two-factor authentication is
                                                disabled
                                            </p>
                                            <p className="mt-1.5 text-sm leading-relaxed text-amber-800 dark:text-amber-200">
                                                When enabled, you will be
                                                prompted for a secure pin during
                                                login. This pin can be retrieved
                                                from a TOTP-supported
                                                application on your phone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {twoFactorEnabled && (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="mb-3 text-sm font-medium text-foreground">
                                            Recovery Codes
                                        </h4>
                                        <TwoFactorRecoveryCodes
                                            recoveryCodesList={
                                                recoveryCodesList
                                            }
                                            fetchRecoveryCodes={
                                                fetchRecoveryCodes
                                            }
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={errors}
                        />
                    </CardContent>

                    <CardFooter className="flex items-center justify-between gap-4">
                        <div>
                            {twoFactorEnabled ? (
                                <Form
                                    action={disable().url}
                                    method={disable().method}
                                >
                                    {({ processing }) => (
                                        <Button
                                            variant="destructive"
                                            type="submit"
                                            disabled={processing}
                                            className="min-w-[140px]"
                                        >
                                            <Icon
                                                iconNode={ShieldBan}
                                                className="mr-2 h-4 w-4"
                                            />
                                            {processing
                                                ? 'Disabling...'
                                                : 'Disable 2FA'}
                                        </Button>
                                    )}
                                </Form>
                            ) : (
                                <div>
                                    {hasSetupData ? (
                                        <Button
                                            onClick={() =>
                                                setShowSetupModal(true)
                                            }
                                            className="min-w-[140px]"
                                        >
                                            <Icon
                                                iconNode={ShieldCheck}
                                                className="mr-2 h-4 w-4"
                                            />
                                            Continue Setup
                                        </Button>
                                    ) : (
                                        <Form
                                            action={enable().url}
                                            method={enable().method}
                                            onSuccess={() =>
                                                setShowSetupModal(true)
                                            }
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="min-w-[140px]"
                                                >
                                                    <Icon
                                                        iconNode={ShieldCheck}
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    {processing
                                                        ? 'Enabling...'
                                                        : 'Enable 2FA'}
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {twoFactorEnabled
                                ? 'Keep your recovery codes safe'
                                : 'Recommended for enhanced security'}
                        </p>
                    </CardFooter>
                </Card>
            </SettingsLayout>
        </Layout>
    );
}
