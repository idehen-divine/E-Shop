import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-muted/50 via-background to-muted/30 p-6 md:p-10">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    <Link
                        href={home()}
                        className="flex items-center justify-center gap-2 font-medium transition-opacity hover:opacity-80"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <AppLogoIcon className="size-6 fill-current text-primary" />
                        </div>
                        <span className="sr-only">{title}</span>
                    </Link>

                    <Card className="border-2 shadow-lg">
                        <CardHeader className="space-y-3 pb-6 text-center">
                            <CardTitle className="text-2xl font-semibold">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
