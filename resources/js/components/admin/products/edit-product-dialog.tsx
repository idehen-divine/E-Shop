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
import { type Category, type Product } from '@/types/products';
import { Form } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';

interface EditProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product;
    categories?: Category[];
}

export function EditProductDialog({
    open,
    onOpenChange,
    product,
    categories = [],
}: EditProductDialogProps) {
    const { toast } = useToast();
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(
        null,
    );
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [removedImages, setRemovedImages] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        product.categories?.map((cat) => cat.id) || [],
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange} key={product.id}>
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Update product information
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={`/admin/products/${product.id}`}
                    method="post"
                    onSuccess={() => {
                        toast({
                            variant: 'success',
                            title: 'Success',
                            description: 'Product updated successfully!',
                        });
                        onOpenChange(false);
                        setMainImagePreview(null);
                        setGalleryPreviews([]);
                        setRemovedImages([]);
                        setSelectedCategories(
                            product.categories?.map((cat) => cat.id) || [],
                        );
                    }}
                    onError={(errors) => {
                        const errorMessages = Object.values(errors).flat();
                        toast({
                            variant: 'destructive',
                            title: 'Error',
                            description:
                                errorMessages.length > 0
                                    ? errorMessages.join(', ')
                                    : 'Failed to update product. Please check the form and try again.',
                        });
                    }}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <input type="hidden" name="_method" value="PATCH" />
                    {removedImages.map((image, index) => (
                        <input
                            key={`removed-${index}`}
                            type="hidden"
                            name="removed_images[]"
                            value={image}
                        />
                    ))}
                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-6">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Product Name *</Label>
                            <Input
                                id="edit-name"
                                name="name"
                                defaultValue={product.name}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">
                                Description
                            </Label>
                            <Textarea
                                id="edit-description"
                                name="description"
                                defaultValue={product.description || ''}
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price *</Label>
                                <Input
                                    id="edit-price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={product.price}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-compare_at_price">
                                    Compare At Price
                                </Label>
                                <Input
                                    id="edit-compare_at_price"
                                    name="compare_at_price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={
                                        product.compare_at_price || ''
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-main-image">
                                Main Product Image (Max 2MB)
                            </Label>
                            <Input
                                id="edit-main-image"
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
                            <p className="text-xs text-muted-foreground">
                                Leave empty to keep the current image
                            </p>
                            {(mainImagePreview || product.image) && (
                                <div className="mt-2">
                                    <img
                                        src={
                                            mainImagePreview ||
                                            product.image ||
                                            ''
                                        }
                                        alt="Product preview"
                                        className="h-32 w-32 rounded-lg border object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-gallery-images">
                                Gallery Images (Max 2MB each)
                            </Label>
                            <Input
                                id="edit-gallery-images"
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
                                Leave empty to keep current gallery images
                            </p>
                            {(galleryPreviews.length > 0 ||
                                (product.images?.length ?? 0) > 0) && (
                                <div className="mt-2">
                                    <Label className="text-sm font-medium">
                                        Gallery Images
                                    </Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {product.images
                                            ?.filter(
                                                (image) =>
                                                    !removedImages.includes(
                                                        image,
                                                    ),
                                            )
                                            .map((image, index) => (
                                                <div
                                                    key={`existing-${index}`}
                                                    className="group relative"
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="h-24 w-24 rounded-lg border object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setRemovedImages(
                                                                (prev) => [
                                                                    ...prev,
                                                                    image,
                                                                ],
                                                            );
                                                        }}
                                                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    <div className="absolute -top-1 -left-1 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
                                                        Current
                                                    </div>
                                                </div>
                                            ))}
                                        {galleryPreviews.map(
                                            (preview, index) => (
                                                <div
                                                    key={`new-${index}`}
                                                    className="group relative"
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`New ${index + 1}`}
                                                        className="h-24 w-24 rounded-lg border border-green-500 object-cover"
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
                                                    <div className="absolute -top-1 -left-1 rounded-full bg-green-500 px-1.5 py-0.5 text-xs text-white">
                                                        New
                                                    </div>
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
                                                id={`edit-category-${category.id}`}
                                                name="categories[]"
                                                value={category.id}
                                                defaultChecked={selectedCategories.includes(
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
                                                htmlFor={`edit-category-${category.id}`}
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
                    </div>

                    <DialogFooter className="mt-auto border-t px-6 pt-4 pb-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                setMainImagePreview(null);
                                setGalleryPreviews([]);
                                setRemovedImages([]);
                                setSelectedCategories(
                                    product.categories?.map((cat) => cat.id) ||
                                        [],
                                );
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Update Product</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
