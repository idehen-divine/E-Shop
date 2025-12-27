import { Head, usePage } from '@inertiajs/react';
import { Palette } from 'lucide-react';

import AppearanceTabs from '@/components/appearance-tabs';
import { Icon } from '@/components/icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type BreadcrumbItem, type SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import ShopLayout from '@/layouts/app/shop-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const page = usePage<SharedData>();
    const isAdmin =
        page.props.auth.user?.roles?.includes('SUPER_ADMIN') ||
        page.props.auth.user?.roles?.includes('ADMIN');
    const Layout = isAdmin ? AppLayout : ShopLayout;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Appearance settings',
            href: editAppearance().url,
        },
    ];

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Icon
                                    iconNode={Palette}
                                    className="h-5 w-5 text-primary"
                                />
                            </div>
                            <div>
                                <CardTitle>Appearance Settings</CardTitle>
                                <CardDescription>
                                    Customize how the application looks and
                                    feels
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h4 className="mb-4 text-sm font-medium text-foreground">
                                    Theme Preference
                                </h4>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Choose how the application appears to you.
                                    You can select a light theme, dark theme, or
                                    match your system settings.
                                </p>
                                <AppearanceTabs />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </SettingsLayout>
        </Layout>
    );
}
