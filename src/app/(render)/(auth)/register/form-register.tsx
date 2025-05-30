"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { registerSchema } from "@/lib/validators";
import { days, months } from "@/types/dates-list";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess: (email: string) => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useSignUp();
  const { loaded } = useClerk();
  const {
    username,
    setUsername,
    isChecking,
    isAvailable,
    isValid
  } = useUsernameCheck();


  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      displayName: "",
      username: "",
      password: "",
      birthDay: "",
      birthMonth: "",
      birthYear: "",
      marketingEmails: false,
    },
  });


  form.watch((value) => {
    if (value.username) {
      setUsername(value.username);
    }
  });


  const onSubmit = async (data: FormValues) => {
    if (!signUp || !loaded) return;

    setIsLoading(true);

    try {

      //por motivo de segurança, não salvamos as senhas. 
      // apenas informações necessarias!!!
      sessionStorage.setItem('registrationData', JSON.stringify({
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        birthDate: `${data.birthYear}-${data.birthMonth}-${data.birthDay}`,
        marketingEmails: data.marketingEmails
      }));

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        username: data.username,
        firstName: data.displayName,
        unsafeMetadata: {
          birthDate: `${data.birthYear}-${data.birthMonth}-${data.birthDay}`,
          marketingEmails: data.marketingEmails,
        },
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      onSuccess(data.email);
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Ocorreu um erro ao registrar. Por favor, tente novamente.";

      if (error.errors) {
        errorMessage = error.errors[0]?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      form.setError("root", {
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="w-full max-w-md p-8 bg-background rounded-md dark:bg-[#313338]">
      <h1 className="text-2xl font-bold text-center mb-6">Criar uma conta</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-baseline mb-1">
                  <label className="text-xs font-semibold uppercase text-[#B5BAC1]">
                    E-MAIL <span className="text-red-500">*</span>
                  </label>
                </div>
                <FormControl>
                  <Input {...field} className="dark:bg-[#1E1F22] border-none" />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-baseline mb-1">
                  <label className="text-xs font-semibold uppercase text-[#B5BAC1]">NOME EXIBIDO</label>
                </div>
                <FormControl>
                  <Input {...field} className="dark:bg-[#1E1F22] border-none" />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-baseline mb-1">
                  <label className="text-xs font-semibold uppercase text-[#B5BAC1]">
                    NOME DE USUÁRIO <span className="text-red-500">*</span>
                  </label>
                </div>
                <FormControl>
                  <Input {...field} className="dark:bg-[#1E1F22] border-none" />
                </FormControl>
                <div className="relative">
                  {isChecking && (
                    <div className="absolute right-3 top-2.5">
                      <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    </div>
                  )}

                  {isValid && isAvailable !== null && !isChecking && (
                    <p className={`text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {isAvailable
                        ? 'Nome disponível!'
                        : 'Este nome já está em uso'}
                    </p>
                  )}
                </div>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-baseline mb-1">
                  <label className="text-xs font-semibold uppercase text-[#B5BAC1]">
                    SENHA <span className="text-red-500">*</span>
                  </label>
                </div>
                <FormControl>
                  <Input {...field} type="password" className="dark:bg-[#1E1F22] border-none" />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <div>
            <div className="flex items-baseline mb-1">
              <label className="text-xs font-semibold uppercase text-[#B5BAC1]">
                DATA DE NASCIMENTO <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="birthDay"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="dark:bg-[#1E1F22] border-none">
                          <SelectValue placeholder="Dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-[#1E1F22] border-[#1E1F22]">
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthMonth"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="dark:bg-[#1E1F22] border-none">
                          <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-[#1E1F22] border-[#1E1F22]">
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthYear"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="dark:bg-[#1E1F22] border-none">
                          <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-[#1E1F22] border-[#1E1F22] max-h-[200px]">
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#5865F2] border-[#B5BAC1]"
                  />
                </FormControl>
                <div className="text-xs text-[#B5BAC1] leading-tight">
                  (Opcional) Tudo bem me mandar e-mails com atualizações, dicas e ofertas especiais. Você
                  pode mudar isso a qualquer momento.
                </div>
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <p className="text-red-400 text-sm">{form.formState.errors.root.message}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] py-3 mt-4 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Continuar"}
          </Button>

          <p className="text-xs text-[#B5BAC1] mt-4">
            Ao se registrar, você concorda com os{" "}
            <Link href="#" className="text-[#00A8FC] hover:underline">
              termos de serviço
            </Link>{" "}
            e a{" "}
            <Link href="#" className="text-[#00A8FC] hover:underline">
              política de privacidade
            </Link>.
          </p>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-[#00A8FC] text-sm hover:underline">
          Já tem uma conta?
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
