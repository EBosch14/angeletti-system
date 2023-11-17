"use client";

import { AlertModal } from "@/components/modals/alert-modal";
// import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
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
// import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client, Service } from "@prisma/client";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const FormSchema = z.object({
  client_id: z.string(),
  issues: z.string(),
  description: z.string(),
  solution: z.string().optional(),
  state: z.string(),
  price: z.coerce.number().optional(),
  is_paid: z.string(),
});

type ServiceFormInput = z.infer<typeof FormSchema>;

interface ServiceFormProps {
  initialData: Service | null;
  clients: Client[];
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  clients,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Editar servicio" : "Crear servicio";
  const description = initialData
    ? "Editar un servicio"
    : "Crear un nuevo servicio";
  const toastMessage = initialData
    ? "servicio actualizado correctamente."
    : "servicio creado correctamente.";
  const action = initialData ? "Guardar cambios" : "Crear";
  const toastError = initialData
    ? "Ups! Algo salio mal, no se pudo actualizar el servicio."
    : "Ups! Algo salio mal, no se pudo crear el servicio.";

  const form = useForm<ServiceFormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      client_id: initialData?.client_id.toString() || undefined,
      issues: initialData?.issues,
      description: initialData?.description,
      solution: initialData?.solution || undefined,
      price: parseFloat(String(initialData?.price)),
      state: initialData?.state ? "En proceso" : "Terminado",
      is_paid: initialData?.is_paid ? "si" : "no",
    },
  });

  const onSubmit = async (data: ServiceFormInput) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/services/${params.service_id}`, data);
      } else {
        await axios.post(`/api/services`, data);
      }
      router.refresh();
      router.push(`/services`);
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
      await axios.delete(`/api/providers/${params.provider_id}`);
      router.refresh();
      router.push("/providers");
      toast.success("Proveedor eliminado exitosamente");
    } catch (error) {
      toast.error(
        "Ups! Algo salio mal, no se pudo eliminar el proveedor seleccionado."
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              //Name Field
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecciona una opcion"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients?.map((e) => {
                        return (
                          <SelectItem key={e.id} value={e.id.toString()}>
                            {e.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              //Email Field
              control={form.control}
              name="issues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problema</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="No enciende la pantala cuando..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              //Phone Field
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={loading}
                      placeholder="pc lenovo gris..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              //Country Field
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solucion</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Cambiamos el..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="1" value="En proceso">
                        En proceso
                      </SelectItem>
                      <SelectItem key="2" value="Terminado">
                        Terminado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_paid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pagado</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="1" value="si">
                        Si
                      </SelectItem>
                      <SelectItem key="2" value="no">
                        No
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
