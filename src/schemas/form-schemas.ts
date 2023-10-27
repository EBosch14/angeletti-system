import z from "zod";

export const ProviderFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "El nombre debe contener al menos 3 caracteres",
    })
    .max(30, {
      message: "El nombre no debe contener más de 30 caracteres",
    })
    .trim(),
  email: z.string().email().trim().optional(),
  phone: z.string().trim(),
  country: z.string().trim().optional(),
  state: z.string().trim().optional(),
  city: z.string().trim().optional(),
  address: z.string().trim().optional(),
  postal_code: z.string().trim().optional(),
  // other_contacts: z.string().trim().optional(),
});
