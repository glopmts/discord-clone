"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import VefiqueCode from "@/components/verfique-code"
import { useAuth } from "@/services/auth/authServices"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
})

const LoginPage = () => {
  const [isVerifyCodeStep, setIsVerifyCodeStep] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentEmail, setCurrentEmail] = useState("")
  const router = useRouter()

  const { signInWithEmailPassword, sendVerificationEmail } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const result = await signInWithEmailPassword({
        email: values.email,
        password: values.password,
      })

      if (result.success) {
        router.push("/channels/me")
        return
      }

      setCurrentEmail(values.email)
      const verificationResult = await sendVerificationEmail({
        email: values.email,
        strategy: "email_code",
      })

      if (verificationResult.success) {
        setIsVerifyCodeStep(true)
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSuccess = () => {
    router.push("/channels/me")
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b flex items-center justify-center p-4">
      {isVerifyCodeStep ? (
        <VefiqueCode
          text={`Um código de verificação foi enviado para ${currentEmail}`}
          isLoading={isLoading}
          onSuccess={handleCodeSuccess}
          context="signIn"
        />
      ) : (
        <div className="bg-[#313338] p-8 max-w-[784px] w-full rounded-md shadow-xl flex flex-col md:flex-row gap-8">
          {/* Left side - Login form */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-6 flex flex-col items-center text-center">
              <h1 className="font-bold text-2xl text-white">Boas-vindas de volta!</h1>
              <span className="text-[#B5BAC1] text-base">Estamos muito animados em te ver novamente!</span>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-[#B5BAC1]">
                        E-mail ou número de telefone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} className="bg-[#151616] h-10" />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col space-y-1">
                        <FormLabel className="uppercase text-xs font-bold text-[#B5BAC1]">
                          Senha <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="" {...field} className="bg-zinc-900 h-10" />
                        </FormControl>
                        <Link href="#" className="text-[#00A8FC] text-sm hover:underline w-fit">
                          Esqueceu sua senha?
                        </Link>
                      </div>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium h-10 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Carregando..." : "Entrar"}
                </Button>
              </form>
            </Form>

            <div className="mt-2 text-sm text-[#B5BAC1]">
              <span>Precisando de uma conta? </span>
              <Link href="/register" className="text-[#00A8FC] hover:underline">
                Registre-se
              </Link>
            </div>
          </div>

          {/* Right side - QR Code */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <div className="bg-white p-2 rounded-md w-[176px] h-[176px] flex items-center justify-center">
              <Image src="/images/qrcoder-login.jpeg" alt="QR Code" width={160} height={160} className="rounded-sm" />
            </div>

            <div className="flex flex-col items-center text-center mt-6 space-y-2">
              <h2 className="text-xl font-bold text-white">Entrar com código QR</h2>
              <p className="text-[#B5BAC1] text-sm">
                Escaneie isto com o <span className="font-bold">app móvel do Discord</span> para fazer login
                imediatamente.
              </p>
            </div>

            <button className="text-[#00A8FC] text-sm mt-4 hover:underline">Ou, faça login com uma passkey</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
