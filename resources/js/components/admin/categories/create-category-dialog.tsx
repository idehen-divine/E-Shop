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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Category } from '@/types/products';
import { Form } from '@inertiajs/react';
import { useState } from 'react';

interface CreateCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    parentCategories?: Category[];
}

export function CreateCategoryDialog({
    open,
    onOpenChange,
    parentCategories = [],
}: CreateCategoryDialogProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [parentId, setParentId] = useState<string>('');

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            key={open ? 'open' : 'closed'}
        >
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
                <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>
                        Add a new product category
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action="/admin/categories"
                    method="post"
                    onSuccess={() => {
                        onOpenChange(false);
                        setImagePreview(null);
                        setParentId('');
                    }}
                    resetOnSuccess
                >
                    {({ errors, processing, wasSuccessful, setData }) => {
                        const handleActiveChange = (
                            checked: boolean | 'indeterminate',
                        ) => {
                            if (setData && typeof setData === 'function') {
                                setData('is_active', checked === true);
                            }
                        };

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
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            onChange={(e) => {
                                                if (
                                                    setData &&
                                                    typeof setData ===
                                                        'function'
                                                ) {
                                                    setData(
                                                        'description',
                                                        e.target.value,
                                                    );
                                                }
                                            }}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-destructive">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="parent_id">
                                                Parent Category
                                            </Label>
                                            <Select
                                                value={parentId}
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
                                                    {parentCategories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id
                                                                }
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.parent_id && (
                                                <p className="text-sm text-destructive">
                                                    {errors.parent_id}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="order">Order</Label>
                                            <Input
                                                id="order"
                                                name="order"
                                                type="number"
                                                defaultValue={0}
                                                onChange={(e) => {
                                                    if (
                                                        setData &&
                                                        typeof setData ===
                                                            'function'
                                                    ) {
                                                        setData(
                                                            'order',
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 0,
                                                        );
                                                    }
                                                }}
                                            />
                                            {errors.order && (
                                                <p className="text-sm text-destructive">
                                                    {errors.order}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image">
                                            Category Image (Max 2MB)
                                        </Label>
                                        <Input
                                            id="image"
                                            name="image"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (
                                                    file &&
                                                    setData &&
                                                    typeof setData ===
                                                        'function'
                                                ) {
                                                    setData('image', file);
                                                    const reader =
                                                        new FileReader();
                                                    reader.onloadend = () => {
                                                        setImagePreview(
                                                            reader.result as string,
                                                        );
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        {errors.image && (
                                            <p className="text-sm text-destructive">
                                                {errors.image}
                                            </p>
                                        )}
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-32 w-32 rounded-lg border object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="is_active"
                                            name="is_active"
                                            defaultChecked={true}
                                            onCheckedChange={handleActiveChange}
                                        />
                                        <Label
                                            htmlFor="is_active"
                                            className="cursor-pointer"
                                        >
                                            Active
                                        </Label>
                                    </div>

                                    {wasSuccessful && (
                                        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                            Category created successfully!
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="mt-0">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            onOpenChange(false);
                                            setImagePreview(null);
                                            setParentId('');
                                        }}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Creating...'
                                            : 'Create Category'}
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
