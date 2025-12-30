import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';

export type CategoryColumnKey = 'name' | 'parent' | 'created_at' | 'actions';

interface ColumnOption {
    key: CategoryColumnKey;
    label: string;
}

const allColumns: ColumnOption[] = [
    { key: 'name', label: 'Name' },
    { key: 'parent', label: 'Parent' },
    { key: 'created_at', label: 'Created' },
    { key: 'actions', label: 'Actions' },
];

export const defaultVisibleColumns: CategoryColumnKey[] = [
    'name',
    'parent',
    'actions',
];

interface CategoryColumnVisibilityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    visibleColumns: CategoryColumnKey[];
    onColumnsChange: (columns: CategoryColumnKey[]) => void;
}

export function CategoryColumnVisibilityDialog({
    open,
    onOpenChange,
    visibleColumns,
    onColumnsChange,
}: CategoryColumnVisibilityDialogProps) {
    const handleToggleColumn = (columnKey: CategoryColumnKey) => {
        if (visibleColumns.includes(columnKey)) {
            onColumnsChange(visibleColumns.filter((key) => key !== columnKey));
        } else {
            onColumnsChange([...visibleColumns, columnKey]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Settings2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Column Visibility</DialogTitle>
                            <DialogDescription>
                                Choose which columns to display
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    {allColumns.map((column) => (
                        <div
                            key={column.key}
                            className="flex items-center gap-2"
                        >
                            <Checkbox
                                id={`column-${column.key}`}
                                checked={visibleColumns.includes(column.key)}
                                onCheckedChange={() =>
                                    handleToggleColumn(column.key)
                                }
                            />
                            <Label
                                htmlFor={`column-${column.key}`}
                                className="cursor-pointer text-sm font-normal"
                            >
                                {column.label}
                            </Label>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            onColumnsChange(defaultVisibleColumns);
                        }}
                    >
                        Reset to Default
                    </Button>
                    <Button type="button" onClick={() => onOpenChange(false)}>
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
