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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { type Category } from '@/types/products';
import { Form } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';

interface CreateProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories?: Category[];
}

export function CreateProductDialog({
    open,
    onOpenChange,
    categories = [],
}: CreateProductDialogProps) {
    const { toast } = useToast();
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(
        null,
    );
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isFeatured, setIsFeatured] = useState<boolean>(false);

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            key={open ? 'open' : 'closed'}
        >
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle>Create New Product</DialogTitle>
                    <DialogDescription>
                        Add a new product to your inventory
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action="/admin/products"
                    method="post"
                    onSuccess={() => {
                        toast({
                            variant: 'success',
                            title: 'Success',
                            description: 'Product created successfully!',
                        });
                        onOpenChange(false);
                        setMainImagePreview(null);
                        setGalleryPreviews([]);
                        setSelectedCategories([]);
                        setIsFeatured(false);
                    }}
                    onError={(errors) => {
                        const errorMessages = Object.values(errors).flat();
                        toast({
                            variant: 'destructive',
                            title: 'Error',
                            description:
                                errorMessages.length > 0
                                    ? errorMessages.join(', ')
                                    : 'Failed to create product. Please check the form and try again.',
                        });
                    }}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input id="name" name="name" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="compare_at_price">
                                    Compare At Price
                                </Label>
                                <Input
                                    id="compare_at_price"
                                    name="compare_at_price"
                                    type="number"
                                    step="0.01"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock *</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="main-image">
                                Main Product Image (Max 2MB)
                            </Label>
                            <Input
                                id="main-image"
                                name="image"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            if (reader.result) {
                                                setMainImagePreview(
                                                    reader.result as string,
                                                );
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    } else {
                                        setMainImagePreview(null);
                                    }
                                }}
                            />
                            {mainImagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={mainImagePreview}
                                        alt="Main preview"
                                        className="h-32 w-32 rounded-lg border object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gallery-images">
                                Gallery Images (Max 2MB each)
                            </Label>
                            <Input
                                id="gallery-images"
                                name="images[]"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(
                                        e.target.files || [],
                                    );
                                    if (files.length > 0) {
                                        const newPreviews: string[] = [];
                                        files.forEach((file) => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                newPreviews.push(
                                                    reader.result as string,
                                                );
                                                if (
                                                    newPreviews.length ===
                                                    files.length
                                                ) {
                                                    setGalleryPreviews(
                                                        (prev) => [
                                                            ...prev,
                                                            ...newPreviews,
                                                        ],
                                                    );
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        });
                                    }
                                }}
                            />
                            <p className="text-xs text-muted-foreground">
                                Select multiple images to add to the gallery
                            </p>
                            {galleryPreviews.length > 0 && (
                                <div className="mt-2">
                                    <Label className="text-sm font-medium">
                                        Gallery Images Preview
                                    </Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {galleryPreviews.map(
                                            (preview, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative"
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="h-24 w-24 rounded-lg border object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setGalleryPreviews(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (
                                                                            _,
                                                                            i,
                                                                        ) =>
                                                                            i !==
                                                                            index,
                                                                    ),
                                                            );
                                                        }}
                                                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Categories</Label>
                            <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                id={`category-${category.id}`}
                                                name="categories[]"
                                                value={category.id}
                                                checked={selectedCategories.includes(
                                                    category.id,
                                                )}
                                                onChange={(e) => {
                                                    const newCategories = e
                                                        .target.checked
                                                        ? [
                                                              ...selectedCategories,
                                                              category.id,
                                                          ]
                                                        : selectedCategories.filter(
                                                              (id) =>
                                                                  id !==
                                                                  category.id,
                                                          );
                                                    setSelectedCategories(
                                                        newCategories,
                                                    );
                                                }}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            <Label
                                                htmlFor={`category-${category.id}`}
                                                className="cursor-pointer text-sm"
                                            >
                                                {category.name}
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No categories available
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                name="is_featured"
                                value="1"
                                checked={isFeatured}
                                onChange={(e) =>
                                    setIsFeatured(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label
                                htmlFor="is_featured"
                                className="cursor-pointer"
                            >
                                Featured
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="mt-auto border-t px-6 pt-4 pb-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                setMainImagePreview(null);
                                setGalleryPreviews([]);
                                setSelectedCategories([]);
                                setIsFeatured(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Create Product</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
