import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { ShopHeader } from '@/components/shop-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function ShopLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="header">
            <ShopHeader />
            <AppContent variant="header" className="overflow-x-hidden">
                {children}
            </AppContent>
        </AppShell>
    );
}

