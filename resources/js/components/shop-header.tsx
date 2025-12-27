import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { dashboard, home, login, register } from '@/routes';
import cart from '@/routes/cart';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import AppLogo from './app-logo';

export function ShopHeader() {
    const { auth, cartCount = 0 } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const isAdmin =
        auth.user?.roles?.includes('SUPER_ADMIN') ||
        auth.user?.roles?.includes('ADMIN');

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-[1536px]">
                <Link href={home()} prefetch className="flex items-center space-x-2">
                    <AppLogo />
                </Link>

                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        asChild
                    >
                        <Link href={cart.index()}>
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </Button>

                    {auth.user ? (
                        isAdmin ? (
                            <Button asChild>
                                <Link href={dashboard()}>Go to Dashboard</Link>
                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="size-10 rounded-full p-1"
                                    >
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" asChild>
                                <Link href={login()}>Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href={register()}>Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

