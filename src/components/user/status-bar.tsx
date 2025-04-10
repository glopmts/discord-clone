"use client"

import { Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface StatusBarProps {
  username?: string
  userImage?: string
  status: "ok" | "limited" | "warning" | "risk" | "suspended"
}

export default function StatusBar({ username = "User", userImage, status = "ok" }: StatusBarProps) {
  const getStatusPosition = () => {
    switch (status) {
      case "ok":
        return "0%"
      case "limited":
        return "25%"
      case "warning":
        return "50%"
      case "risk":
        return "75%"
      case "suspended":
        return "100%"
      default:
        return "0%"
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case "ok":
        return "Tudo certo!"
      case "limited":
        return "Limitado"
      case "warning":
        return "Muito"
      case "risk":
        return "Em risco"
      case "suspended":
        return "Suspenso"
      default:
        return "Tudo certo!"
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="flex gap-4 items-start">
        <div className="w-16 h-16 relative border-4 bg-zinc-950 border-zinc-800 rounded-full p-1 flex-shrink-0">
          {userImage ? (
            <Image src={userImage || "/placeholder.svg"} alt={username} fill className="object-cover rounded-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-full bg-zinc-800 text-center">
              <span className="text-xl font-medium">{username.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-1">
            <h2 className="text-white text-lg">Sua conta está</h2>
            <span className="text-lg font-semibold text-[#40A258]">toda em ordem</span>
          </div>

          <div className="text-sm text-gray-300">
            Obrigado por respeitar os{" "}
            <Link href="#" className="text-blue-500 hover:underline">
              Termos de Serviço
            </Link>{" "}
            do Discord e as{" "}
            <Link href="#" className="text-blue-500 hover:underline">
              diretrizes da comunidade
            </Link>
            . Se você infringir as regras, isso será exibido aqui.
          </div>

          <div className="mt-4 relative">
            <div className="h-2 bg-zinc-800 rounded-full w-full mt-2">
              <div
                className="absolute -top-8 left-0 h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                style={{ width: getStatusPosition() }}
              />

              {/* Status markers */}
              <div className="absolute left-0 w-full flex justify-between">
                <div className="relative -top-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${status === "ok" ? "bg-green-600 text-white" : "bg-zinc-700"}`}
                  >
                    {status === "ok" ? (
                      <Check className="w-4 h-4 text-black" />
                    ) : (
                      <div className="w-2 h-2 bg-zinc-500 rounded-full" />
                    )}
                  </div>
                  <div className="text-xs mt-1 text-center">{status === "ok" ? "Tudo certo!" : "Tudo certo"}</div>
                </div>

                <div className="relative -top-1">
                  <div className={`w-4 h-4 rounded-full ${status === "limited" ? "bg-yellow-500" : "bg-zinc-700"}`} />
                  <div className="text-xs mt-1 text-center">Limitado</div>
                </div>

                <div className="relative -top-1">
                  <div className={`w-4 h-4 rounded-full ${status === "warning" ? "bg-orange-500" : "bg-zinc-700"}`} />
                  <div className="text-xs mt-1 text-center">Muito</div>
                </div>

                <div className="relative -top-1">
                  <div className={`w-4 h-4 rounded-full ${status === "risk" ? "bg-red-500" : "bg-zinc-700"}`} />
                  <div className="text-xs mt-1 text-center">Em risco</div>
                </div>

                <div className="relative -top-1">
                  <div className={`w-4 h-4 rounded-full ${status === "suspended" ? "bg-red-700" : "bg-zinc-700"}`} />
                  <div className="text-xs mt-1 text-center">Suspenso</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
