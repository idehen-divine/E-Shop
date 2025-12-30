import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type Category } from '@/types/products';
import { Form } from '@inertiajs/react';
import { useState } from 'react';

interface EditCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category;
    parentCategories?: Category[];
}

export function EditCategoryDialog({
    open,
    onOpenChange,
    category,
    parentCategories = [],
}: EditCategoryDialogProps) {
    const [parentId, setParentId] = useState<string>(category.parent_id || '');

    return (
        <Dialog open={open} onOpenChange={onOpenChange} key={category.id}>
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Update category information
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={`/admin/categories/${category.id}`}
                    method="patch"
                    onSuccess={() => {
                        onOpenChange(false);
                    }}
                >
                    {({ errors, processing, wasSuccessful, setData }) => {
                        return (
                            <>
                                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Category Name *
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={category.name}
                                            required
                                            onChange={(e) => {
                                                if (
                                                    setData &&
                                                    typeof setData ===
                                                        'function'
                                                ) {
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    );
                                                }
                                            }}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="parent_id">
                                            Parent Category
                                        </Label>
                                        <Select
                                            value={parentId || 'none'}
                                            onValueChange={(value) => {
                                                setParentId(value);
                                                if (
                                                    setData &&
                                                    typeof setData ===
                                                        'function'
                                                ) {
                                                    setData(
                                                        'parent_id',
                                                        value === 'none'
                                                            ? null
                                                            : value,
                                                    );
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select parent category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    None (Root Category)
                                                </SelectItem>
                                                {parentCategories
                                                    .filter(
                                                        (cat) =>
                                                            cat.id !==
                                                            category.id,
                                                    )
                                                    .map((cat) => (
                                                        <SelectItem
                                                            key={cat.id}
                                                            value={cat.id}
                                                        >
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.parent_id && (
                                            <p className="text-sm text-destructive">
                                                {errors.parent_id}
                                            </p>
                                        )}
                                    </div>

                                    {wasSuccessful && (
                                        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            Category updated successfully!
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="mt-0">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Updating...'
                                            : 'Update Category'}
                                    </Button>
                                </DialogFooter>
                            </>
                        );
                    }}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
