import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  displayName: z.string().min(1, {
    message: "Por favor, insira um nome de exibição.",
  }),
  username: z.string().min(2, {
    message: "Nome de usuário deve ter pelo menos 2 caracteres.",
  }),
  password: z.string().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres.",
  }),
  birthDay: z.string({
    required_error: "Selecione um dia.",
  }),
  birthMonth: z.string({
    required_error: "Selecione um mês.",
  }),
  birthYear: z.string({
    required_error: "Selecione um ano.",
  }),
  marketingEmails: z.boolean().default(false).optional(),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
