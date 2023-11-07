"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Image, Product, Provider, Size } from "@prisma/client";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

export const FormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "El nombre debe contener al menos 1 caracter",
    })
    .max(25, {
      message: "El nombre no debe contener más de 25 caracteres",
    })
    .trim(),
  images: z.array(
    z.object({
      url: z.string().trim(),
    })
  ),
  stock: z.coerce.number().int().nonnegative(),
  provider_id: z.string(),
  provider_code: z.string().optional(),
  purchase_price: z.coerce.number().min(1),
  sale_price: z.coerce.number().min(1),
  description: z.string().min(10).max(5000).trim().optional(),
  category_id: z.string().min(1).trim(),
  model: z.string().min(1).trim().optional(),
  brand: z.string().min(1).trim().optional(),
  size_id: z.string().min(1).trim(),
  is_archived: z.boolean().default(false).optional(),
});

type ProductFormInput = z.infer<typeof FormSchema>;

interface ProductWithImages extends Product {
  images: Image[];
}

interface ProductFormProps {
  initialData: ProductWithImages | null;
  categories: Category[];
  sizes: Size[];
  providers: Provider[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  providers,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sizesFilter, setSizesFilter] = useState<Size[]>([]);
  const [categoryId, setCategoryId] = useState("");

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Editar producto" : "Crear producto";
  const description = initialData
    ? "Editar un producto"
    : "Crear un nuevo producto";
  const toastMessage = initialData
    ? "Producto actualizado correctamente."
    : "Producto creado correctamente.";
  const action = initialData ? "Guardar cambios" : "Crear";
  const toastError = initialData
    ? "Ups! Algo salio mal, no se pudo actualizar el producto."
    : "Ups! Algo salio mal, no se pudo crear el producto.";

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: initialData?.name || "",
      brand: initialData?.brand || "",
      category_id: initialData?.category_id || "",
      description: initialData?.description || "",
      images: initialData?.images || [],
      model: initialData?.model || "",
      sale_price: parseFloat(String(initialData?.sale_price)) || undefined,
      stock: initialData?.stock || undefined,
      provider_id: initialData?.provider_id.toString() || undefined,
      is_archived: initialData?.is_archived || false,
      size_id: initialData?.size_id || "",
      purchase_price:
        parseFloat(String(initialData?.purchase_price)) || undefined,
      provider_code: initialData?.provider_code || "",
    },
  });

  useEffect(() => {
    const re = sizes.filter((e) => e.category_id == categoryId);
    setSizesFilter(re);
  }, [categoryId, sizes]);

  const onSubmit = async (data: ProductFormInput) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/products/${params.productId}`, data);
      } else {
        const product = await axios.post(`/api/products`, data);
      }
      router.refresh();
      router.push(`/products`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error(toastError);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Producto eliminado exitosamente");
    } catch (error) {
      toast.error(
        "Ups! Algo salio mal, no se pudo eliminar el producto seleccionado."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imágenes</FormLabel>
                <FormControl>
                  <ImageUpload
                    multipleFiles={true}
                    value={field.value?.map((image) => image?.url)}
                    disable={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter(
                          (current) => current?.url !== url
                        ),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nombre del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Stock del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          // defaultValue={field.value}
                          disabled={loading}
                          placeholder="Selecciona un proveedor"
                          {...field}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem
                          key={provider.id}
                          value={provider.id.toString()}
                        >
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de referencia</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Código" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-10 space-y-0 justify-start">
              <FormField
                control={form.control}
                name="purchase_price"
                render={({ field }) => (
                  <FormItem className="w-28">
                    <FormLabel>Precio pagado</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="9.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sale_price"
                render={({ field }) => (
                  <FormItem className="w-28">
                    <FormLabel>Precio de venta</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="55"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorías</FormLabel>
                  <Select
                    disabled={loading}
                    // onValueChange={field.onChange}
                    onValueChange={(newValue) => {
                      setCategoryId(newValue);
                      field.onChange(newValue);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecciona una categoría"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidades</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecciona una capacidad"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizesFilter.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder=" Modelo del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder=" Marca del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="row-span-2">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-full resize-none"
                      placeholder="Ingresa la descripción de tu producto..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_archived"
              render={({ field }) => (
                <FormItem className="place-self-start flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-8">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Presentar producto</FormLabel>
                    <FormDescription>
                      Este producto aparecerá en la página de inicio
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
