"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  username: z
    .string()
    .max(50, {
      message: "Maximo de caracteres alcanzado",
    })
    .nonempty({ message: "Debe ingresar un usuario" })
    .trim(),
  password: z.string().nonempty({ message: "Debe ingresar una contraseña" }),
});

export default function LoginFrom() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        ...values,
      });
      if (!res?.ok) throw new Error();
      router.push("/");
    } catch (error) {
      console.log("Invalid credentials");
    } finally {
      setLoading(false);
      form.reset();
    }
  }

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-2xl p-5 rounded border-t-4 border-primary bg-primary-foreground">
        <h1 className="text-xl my-4">
          Inicia sesión en{" "}
          <span className="font-bold text-primary">Angeletti Computación</span>
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" variant="default" disabled={loading}>
                Ingresar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
