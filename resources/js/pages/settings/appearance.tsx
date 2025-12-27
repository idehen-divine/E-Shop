import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
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
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </Layout>
    );
}
