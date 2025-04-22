"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import type { User } from "@prisma/client"
import Image from "next/image"

interface UserInfoProps {
  user: User
  isOnline: boolean
}

interface InfoItemProps {
  label: string
  value: string
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="flex items-center justify-between">
    <div className="flex flex-col gap-1.5">
      <span className="font-medium">{label}</span>
      <span>{value}</span>
    </div>
    <button className="px-3 py-1 rounded-md border border-black dark:border-zinc-600 bg-neutral-300 dark:bg-zinc-800 cursor-pointer hover:bg-zinc-600/30 dark:hover:bg-zinc-500/40 transition-colors">
      Editar
    </button>
  </div>
)

const ActionButton = ({
  children,
  variant = "primary",
}: { children: React.ReactNode; variant?: "primary" | "default" }) => (
  <button className={`p-1 rounded-md px-2 text-white w-auto ${variant === "primary" ? "bg-[#4957f0]" : "bg-[#505df0]"}`}>
    <span className="font-base text-sm">{children}</span>
  </button>
)

const SecuritySection = ({
  title,
  description,
  buttonText,
}: {
  title: string
  description?: string
  buttonText: string
}) => (
  <div className="flex flex-col gap-2.5 mt-4">
    <span className="font-base text-md">{title}</span>
    {description && <span className="text-sm">{description}</span>}
    <div className="px-0 py-2">
      <ActionButton>{buttonText}</ActionButton>
    </div>
  </div>
)

export const ProfileModal = ({ user, isOnline }: UserInfoProps) => {
  const userInitial = user.username?.charAt(0).toUpperCase() || ""

  return (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded-md relative">
        {/* Banner */}
        <div className="w-full z-50 h-20 bg-[#537BA2] relative"></div>

        {/* Profile Content */}
        <div className="z-[630] relative p-3 bg-stone-100 dark:bg-zinc-950 rounded-b-md">
          {/* Avatar and User Info */}
          <div className="flex items-baseline gap-2 -top-6 relative w-full">
            <div className="w-20 h-18 relative border-4 bg-stone-100 dark:bg-zinc-950 border-zinc-900 rounded-full p-1">
              {user.image ? (
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.username || "User avatar"}
                  fill
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center rounded-full bg-neutral-500 dark:bg-zinc-800 text-center">
                    <span>{userInitial}</span>
                  </div>
                </div>
              )}
              <div
                className={`absolute bottom-0 right-0 ${isOnline ? "bg-green-500" : "bg-neutral-500 dark:bg-zinc-800"
                  } border-2 border-zinc-900 p-2 rounded-full`}
                aria-label={isOnline ? "Online" : "Offline"}
              />
            </div>

            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col gap-2.5">
                <h1 className="font-semibold text-xl">{user.name}</h1>
                <div className="w-7 h-7 flex items-center justify-center rounded-md bg-neutral-500 dark:bg-zinc-800">
                  <div className="w-4 h-4 text-center flex items-center justify-center rounded-full bg-green-400">
                    <span className="text-black">#</span>
                  </div>
                </div>
              </div>
              <div className="w-auto">
                <ActionButton variant="default">Editar perfil de usuário</ActionButton>
              </div>
            </div>
          </div>

          {/* User Information Card */}
          <div className="mt-3 w-full">
            <div className="dark:bg-[#1A1A1E] bg-neutral-300 w-full rounded-md p-3 flex flex-col gap-2.5">
              <InfoItem label="Nome Exibido" value={user.name || ""} />
              <InfoItem label="Nome De Usuário" value={user.username || ""} />
              <InfoItem label="E-Mail" value={user.email || ""} />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="mt-8 w-full flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex flex-col gap-2.5">
              <h2 className="font-semibold">Senha e autenticação</h2>
              <div className="px-0 py-2">
                <ActionButton>Mudar senha</ActionButton>
              </div>
            </div>

            <SecuritySection
              title="Aplicativo de Autenticação"
              description="Proteja sua conta do Discord com uma camada extra de segurança. Uma vez configurada, será necessário inserir sua senha e completar uma etapa adicional para poder entrar."
              buttonText="Ativar o aplicativo de autenticação"
            />

            <SecuritySection
              title="Chaves De Segurança"
              description="Adicione uma camada extra de proteção à sua conta com uma Chave de Segurança."
              buttonText="Registre uma Chave de Segurança"
            />

            <div className="flex flex-col gap-2.5 mt-4">
              <span className="font-base text-md">Remoção de conta</span>
              <span className="text-sm">Desativar sua conta significa que você poderá recuperá-la quando quiser.</span>
              <div className="px-0 py-2 flex items-center gap-3 w-full">
                <Button variant="destructive">
                  <span className="text-sm">Desativar conta</span>
                </Button>
                <Button variant="outline">
                  <span className="text-sm text-red-400">Excluir conta</span>
                </Button>
              </div>
            </div>
          </div>
          <Image
            src="/images/discord_security.svg"
            alt="Ilustração de segurança"
            width={150}
            height={100}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}
