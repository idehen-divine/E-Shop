import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ActivityIcon,
    AlertTriangleIcon,
    FolderIcon,
    PackageCheckIcon,
    PackageIcon,
    ShoppingCartIcon,
    TrendingUpIcon,
    UsersIcon,
} from 'lucide-react';

interface ServiceResponse<T> {
    code: number;
    message: string;
    data?: T;
}

interface DashboardProduct {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    is_active: boolean;
    is_featured: boolean;
}

interface DashboardUser {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

interface DashboardProps {
    productData?: ServiceResponse<{
        stats: { total: number; active: number; lowStock: number; outOfStock: number };
        recentProducts: DashboardProduct[];
        lowStockProducts: DashboardProduct[];
    }>;
    userData?: ServiceResponse<{
        stats: { total: number; active: number };
        recentUsers: DashboardUser[];
    }>;
    categoryData?: ServiceResponse<{
        stats: { total: number };
    }>;
    cartData?: ServiceResponse<{
        stats: { total: number; active: number };
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard().url }];

export default function Dashboard({ productData, userData, categoryData, cartData }: DashboardProps) {
    const stats = {
        products: productData?.data?.stats,
        users: userData?.data?.stats,
        categories: categoryData?.data?.stats,
        carts: cartData?.data?.stats,
    };

    const recentProducts = productData?.data?.recentProducts || [];
    const lowStockProducts = productData?.data?.lowStockProducts || [];
    const recentUsers = userData?.data?.recentUsers || [];

    if (!stats.products || !stats.users || !stats.categories || !stats.carts) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 items-center justify-center rounded-xl p-4">
                    <p className="text-muted-foreground">Loading dashboard data...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <PackageIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.products.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.products.active} active products
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <UsersIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users.total}</div>
                            <p className="text-xs text-muted-foreground">{stats.users.active} active users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <FolderIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.categories.total}</div>
                            <p className="text-xs text-muted-foreground">Product categories</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Carts</CardTitle>
                            <ShoppingCartIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.carts.active}</div>
                            <p className="text-xs text-muted-foreground">{stats.carts.total} total carts</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
                            <ActivityIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <PackageCheckIcon className="size-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm">In Stock</span>
                                    </div>
                                    <span className="text-sm font-medium">
                                        {stats.products.active - stats.products.lowStock - stats.products.outOfStock}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangleIcon className="size-4 text-yellow-600 dark:text-yellow-400" />
                                        <span className="text-sm">Low Stock</span>
                                    </div>
                                    <span className="text-sm font-medium">{stats.products.lowStock}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangleIcon className="size-4 text-red-600 dark:text-red-400" />
                                        <span className="text-sm">Out of Stock</span>
                                    </div>
                                    <span className="text-sm font-medium">{stats.products.outOfStock}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {lowStockProducts.length > 0 && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                                <AlertTriangleIcon className="size-4 text-yellow-600 dark:text-yellow-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {lowStockProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">{product.sku}</p>
                                            </div>
                                            <Badge
                                                variant={product.stock === 0 ? 'destructive' : 'outline'}
                                                className="text-xs"
                                            >
                                                {product.stock} left
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Recent Products</CardTitle>
                            <TrendingUpIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{product.name}</p>
                                            <div className="flex gap-2">
                                                <p className="text-xs text-muted-foreground">${product.price}</p>
                                                {product.is_featured && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge
                                                variant={product.is_active ? 'default' : 'outline'}
                                                className="text-xs"
                                            >
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {product.stock} in stock
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">Recent Users</CardTitle>
                            <UsersIcon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge
                                                variant={user.is_active ? 'default' : 'outline'}
                                                className="text-xs"
                                            >
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{user.created_at}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
