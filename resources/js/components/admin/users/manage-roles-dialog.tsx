import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { type User } from '@/types';
import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface ManageRolesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    roles?: Role[];
}

export function ManageRolesDialog({
    open,
    onOpenChange,
    user,
    roles = [],
}: ManageRolesDialogProps) {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    useEffect(() => {
        if (open && user.roles) {
            const availableRoleNames = roles.map((r) => r.name);
            const filteredRoles = user.roles.filter((role) =>
                availableRoleNames.includes(role)
            );
            setSelectedRoles(filteredRoles);
        } else if (!open) {
            setSelectedRoles([]);
        }
    }, [user, open, roles]);

    const handleRoleToggle = (role: string) => {
        setSelectedRoles((prev) =>
            prev.includes(role)
                ? prev.filter((r) => r !== role)
                : [...prev, role]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Update roles for user:', user.id, selectedRoles);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Manage Roles</DialogTitle>
                            <DialogDescription>
                                Assign roles to {user.name}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <Label>Available Roles</Label>
                        {roles.length > 0 ? (
                            roles.map((role) => {
                                const roleName = role.name;
                                const formattedLabel = roleName
                                    .replace(/_/g, ' ')
                                    .toLowerCase()
                                    .replace(/\b\w/g, (l) => l.toUpperCase());

                                return (
                                    <div
                                        key={role.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={selectedRoles.includes(
                                                    roleName
                                                )}
                                                onCheckedChange={() =>
                                                    handleRoleToggle(roleName)
                                                }
                                            />
                                            <Label
                                                htmlFor={`role-${role.id}`}
                                                className="cursor-pointer font-medium"
                                            >
                                                {formattedLabel}
                                            </Label>
                                        </div>
                                        {selectedRoles.includes(roleName) && (
                                            <Badge variant="default">
                                                Assigned
                                            </Badge>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No additional roles available
                            </p>
                        )}
                    </div>

                    {selectedRoles.length > 0 && (
                        <div className="rounded-lg bg-muted p-3">
                            <p className="text-sm font-medium mb-2">
                                Selected Roles:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {selectedRoles.map((role) => {
                                    const roleInfo = roles.find(
                                        (r) => r.name === role
                                    );
                                    const formattedLabel = role
                                        .replace(/_/g, ' ')
                                        .toLowerCase()
                                        .replace(/\b\w/g, (l) => l.toUpperCase());

                                    return (
                                        <Badge key={role} variant="default">
                                            {roleInfo
                                                ? formattedLabel
                                                : role}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Update Roles</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

