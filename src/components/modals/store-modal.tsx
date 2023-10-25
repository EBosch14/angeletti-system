"use client";

import axios from "axios";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const FormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "El nombre debe contener al menos 1 caracter.",
    })
    .max(25, {
      message: "El nombre no debe contener más de 25 caracteres.",
    }),
});

type FormInput = z.infer<typeof FormSchema>;

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: FormInput) => {
    try {
      setLoading(true);

      const response = await axios.post("/api/stores", values);

      window.location.assign(`/${response.data.id}`);
      // toast.success("Depósito creado exitosamente.");
    } catch (error) {
      toast.error("Ups! Algo salió mal al crear el depósito.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Crear depósito"
      description="Agregar un nuevo depósito para gestionar nuevos productos y categorías"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
      resetForm={form.reset}>
      <div>
        <div className="space-y-4 py-2 pb-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre:</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Nombre del deposito..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  type="reset"
                  variant="outline"
                  onClick={() => {
                    storeModal.onClose();
                    form.reset();
                  }}>
                  Cancelar
                </Button>
                <Button disabled={loading} type="submit">
                  Continuar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
