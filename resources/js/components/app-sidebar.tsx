import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    FolderTree,
    LayoutGrid,
    Package,
    Shield,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: Package,
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderTree,
    },
    {
        title: 'Users',
        icon: Users,
        items: [
            {
                title: 'Users',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'Admins',
                href: '/admin/admins',
                icon: Shield,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-sidebar-border/80"
        >
            <SidebarHeader className="border-b border-sidebar-border/50 pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="group h-auto px-3 py-3 transition-colors hover:bg-sidebar-accent/50"
                        >
                            <Link href={dashboard()} prefetch className="gap-3">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/50 pt-2">
                <NavFooter items={footerNavItems} className="mb-3" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
