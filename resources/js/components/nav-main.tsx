import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/70">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(
                                resolveUrl(item.href),
                            )}
                            tooltip={{ children: item.title }}
                            className="group h-10 gap-3 rounded-lg px-3 transition-all hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:shadow-sm"
                        >
                            <Link href={item.href} prefetch className="flex items-center gap-3">
                                {item.icon && (
                                    <item.icon className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                                )}
                                <span className="text-sm">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
