import { Icon } from '@/components/icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { destroy } from '@/routes/profile';
import { type SharedData } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useRef } from 'react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const page = usePage<SharedData>();
    const isSuperAdmin = page.props.auth.user?.roles?.includes('SUPER_ADMIN');

    if (isSuperAdmin) {
        return null;
    }

    return (
        <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                        <Icon
                            iconNode={Trash2}
                            className="h-5 w-5 text-red-600 dark:text-red-400"
                        />
                    </div>
                    <div>
                        <CardTitle>Delete Account</CardTitle>
                        <CardDescription>
                            Permanently delete your account and all of its
                            resources
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                    <div className="flex items-start gap-3">
                        <Icon
                            iconNode={AlertTriangle}
                            className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400"
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900 dark:text-red-100">
                                Warning: This action cannot be undone
                            </p>
                            <p className="mt-1 text-sm text-red-800 dark:text-red-200">
                                Once your account is deleted, all of its
                                resources and data will be permanently removed.
                                Please proceed with caution.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            <Icon iconNode={Trash2} className="mr-2 h-4 w-4" />
                            Delete account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            Are you sure you want to delete your account?
                        </DialogTitle>
                        <DialogDescription>
                            Once your account is deleted, all of its resources
                            and data will also be permanently deleted. Please
                            enter your password to confirm you would like to
                            permanently delete your account.
                        </DialogDescription>

                        <Form
                            action={destroy().url}
                            method={destroy().method}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Password
                                        </Label>

                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Enter your password to confirm"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                {processing
                                                    ? 'Deleting...'
                                                    : 'Delete account'}
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}
