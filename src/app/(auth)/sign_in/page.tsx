"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string(),
});

type StoreFormInput = z.infer<typeof formSchema>;

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<StoreFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: StoreFormInput) => {
    setLoading(true);

    const signInData = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });
    console.log(signInData);

    // if (!signInData?.ok) {
    //   toast({
    //     title: "Uh oh! Authenticated unsuccessful",
    //     description: "Incorrect password or username.",
    //   });
    // } else {
    //   router.push(`/`);
    // }

    setLoading(false);
  };

  return (
    <div>
      <h1>signin</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de usuario</FormLabel>
                <FormControl>
                  <Input placeholder="Ingre su nombre de usuario" {...field} />
                </FormControl>
                {/* <FormDescription>Ingre su nombre de usuario</FormDescription> */}
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
                  <Input
                    type="password"
                    placeholder="Ingrese su contraseña"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>Ingrese su contraseña</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className={loading ? "opacity-50" : ""} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
