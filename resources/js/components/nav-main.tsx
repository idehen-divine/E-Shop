import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    const isItemActive = (item: NavItem): boolean => {
        if (item.href && page.url.startsWith(resolveUrl(item.href))) {
            return true;
        }
        if (item.items) {
            return item.items.some((subItem) => isItemActive(subItem));
        }
        return false;
    };

    const isSubItemActive = (item: NavItem): boolean => {
        if (!item.items) {
            return false;
        }
        return item.items.some(
            (subItem) =>
                subItem.href && page.url.startsWith(resolveUrl(subItem.href)),
        );
    };

    const [openItems, setOpenItems] = useState<string[]>(() => {
        return items
            .filter((item) => item.items && isSubItemActive(item))
            .map((item) => item.title);
    });

    const toggleItem = (title: string) => {
        setOpenItems((prev) =>
            prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title],
        );
    };

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/70">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                {items.map((item) => {
                    const hasSubItems = item.items && item.items.length > 0;
                    const isActive = isItemActive(item);
                    const isOpen = openItems.includes(item.title);

                    if (hasSubItems) {
                        return (
                            <Collapsible
                                key={item.title}
                                asChild
                                open={isOpen}
                                onOpenChange={() => toggleItem(item.title)}
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            tooltip={{ children: item.title }}
                                            className="group h-10 gap-3 rounded-lg px-3 transition-all hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:shadow-sm"
                                        >
                                            {item.icon && (
                                                <item.icon className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                                            )}
                                            <span className="flex-1 text-left text-sm">
                                                {item.title}
                                            </span>
                                            <ChevronRight
                                                className={`h-4 w-4 transition-transform ${
                                                    isOpen ? 'rotate-90' : ''
                                                }`}
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={page.url.startsWith(
                                                            resolveUrl(
                                                                subItem.href ||
                                                                    '',
                                                            ),
                                                        )}
                                                    >
                                                        <Link
                                                            href={
                                                                subItem.href ||
                                                                '#'
                                                            }
                                                            prefetch
                                                            className="flex items-center gap-2"
                                                        >
                                                            {subItem.icon && (
                                                                <subItem.icon className="h-4 w-4 flex-shrink-0" />
                                                            )}
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className="group h-10 gap-3 rounded-lg px-3 transition-all hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:shadow-sm"
                            >
                                <Link
                                    href={item.href || '#'}
                                    prefetch
                                    className="flex items-center gap-3"
                                >
                                    {item.icon && (
                                        <item.icon className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                                    )}
                                    <span className="text-sm">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
