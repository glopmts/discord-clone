"use client"

import { Input } from "@/components/ui/input"
import { useAuth } from "@/services/auth/authServices"
import { type FC, useState } from "react"
import ErrorMenssage from "./ErrorMenssage"

type VerifyCodeProps = {
  text: string
  onClick?: () => void
  isLoading?: boolean
  onSuccess?: () => void
  context?: 'signIn' | 'signUp'
}

const VerifyCode: FC<VerifyCodeProps> = ({
  onClick,
  text,
  isLoading: externalLoading,
  onSuccess,
  context = 'signIn'
}) => {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { verifyCode } = useAuth()

  const handleVerifyCode = async () => {
    if (!code) {
      setError("Por favor, digite o código de verificação");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await verifyCode({ code, context });

      if (result.success) {
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      } else {
        setError(result.error || "Falha na verificação do código");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("Ocorreu um erro ao verificar o código");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full dark:bg-[#313338] p-8 max-w-[484px] rounded-md shadow-xl">
      <div className="mb-6 flex flex-col items-center text-center">
        <h1 className="font-bold text-2xl">Verifique seu código</h1>
        {text && <p className="text-[#B5BAC1] mt-2">{text}</p>}
      </div>

      <div className="mb-4 mt-4">
        <Input
          placeholder="Digite o código de verificação"
          className="dark:bg-[#242525] h-10"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {error && <ErrorMenssage error={error} />}
      </div>

      <button
        onClick={onClick || handleVerifyCode}
        className={`w-full h-10 bg-[#4E5BFF] cursor-pointer rounded-md font-bold text-white ${isLoading || externalLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLoading || externalLoading}
      >
        {isLoading || externalLoading ? "Carregando..." : "Verificar código"}
      </button>
    </div>
  )
}

export default VerifyCode