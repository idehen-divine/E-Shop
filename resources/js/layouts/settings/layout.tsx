import Heading from '@/components/heading';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Palette,
    Shield,
    User,
    Lock,
} from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface SettingsNavItem extends NavItem {
    description?: string;
}

export default function SettingsLayout({ children }: PropsWithChildren) {
    const page = usePage<SharedData>();
    const currentPath = page.url;
    const sidebarNavItems: SettingsNavItem[] = [
        {
            title: 'Profile',
            href: edit(),
            icon: User,
            description: 'Personal information',
        },
        {
            title: 'Password',
            href: editPassword(),
            icon: Lock,
            description: 'Security & access',
        },
        {
            title: 'Two-Factor Auth',
            href: show(),
            icon: Shield,
            description: 'Extra security layer',
        },
        {
            title: 'Appearance',
            href: editAppearance(),
            icon: Palette,
            description: 'Theme & display',
        },
    ];

    return (
        <div className="px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-8">
                <Heading
                    title="Settings"
                    description="Manage your profile and account settings"
                />
            </div>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">
                <aside className="w-full lg:w-64 lg:flex-shrink-0">
                    <div className="rounded-lg border bg-card p-3 shadow-sm lg:sticky lg:top-8">
                        <nav className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-2 lg:overflow-x-visible lg:pb-0">
                            {sidebarNavItems.map((item, index) => {
                                const isActive = isSameUrl(
                                    currentPath,
                                    item.href,
                                );
                                return (
                                    <Button
                                        key={`${resolveUrl(item.href)}-${index}`}
                                        size="default"
                                        variant={
                                            isActive ? 'secondary' : 'ghost'
                                        }
                                        asChild
                                        className={cn(
                                            'group relative h-auto w-full justify-start gap-3 px-4 py-3 transition-all duration-200',
                                            isActive &&
                                                'bg-muted font-medium shadow-sm',
                                            !isActive &&
                                                'hover:bg-muted/50',
                                        )}
                                    >
                                        <Link href={item.href}>
                                            {item.icon && (
                                                <Icon
                                                    iconNode={item.icon}
                                                    className={cn(
                                                        'h-5 w-5 flex-shrink-0 transition-colors',
                                                        isActive
                                                            ? 'text-foreground'
                                                            : 'text-muted-foreground group-hover:text-foreground',
                                                    )}
                                                />
                                            )}
                                            <div className="flex flex-1 flex-col items-start gap-0.5">
                                                <span className="text-sm leading-tight">{item.title}</span>
                                                {item.description && (
                                                    <span className="text-xs leading-tight text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 lg:opacity-100">
                                                        {item.description}
                                                    </span>
                                                )}
                                            </div>
                                            {isActive && (
                                                <div className="absolute right-3 h-2 w-2 rounded-full bg-primary" />
                                            )}
                                        </Link>
                                    </Button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <Separator className="lg:hidden" />

                <div className="flex-1 min-w-0">
                    <section className="space-y-8">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
