"use client"

import { createUser } from "@/app/actions/user"
import VerifyCode from "@/components/verfique-code"
import { useAuth } from "@/services/auth/authServices"
import { useRouter } from "next/navigation"
import { useState } from "react"
import RegisterForm from "./form-register"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<"register" | "verify">("register")
  const [email, setEmail] = useState("")
  const { getSignInStatus, getCurrentUserId, getSignUpData } = useAuth()

  const handleRegisterSuccess = (userEmail: string) => {
    setEmail(userEmail)
    setStep("verify")
  }

  const handleVerificationSuccess = async () => {
    try {
      const signUpData = getSignUpData();
      let clerkId = signUpData.userId;

      if (!clerkId) {
        const signInStatus = getSignInStatus();
        if (signInStatus?.firstFactorVerification?.status === 'verified') {
        } else {
          throw new Error("ID do usuário não encontrado");
        }
      }

      const registrationData = JSON.parse(sessionStorage.getItem('registrationData') || '{}');

      await createUser({
        clerk_id: clerkId || getCurrentUserId() || "",
        email: registrationData.email,
        name: registrationData.displayName,
        username: registrationData.username,
        dateNce: registrationData.birthDate ? new Date(registrationData.birthDate) : undefined,
        marketingEmails: registrationData.marketingEmails || false,
      });

      sessionStorage.removeItem('registrationData');

      router.push("/channels/me");
    } catch (error) {
      console.error("Error in verification success:", error);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen ">
      {step === "register" ? (
        <RegisterForm onSuccess={handleRegisterSuccess} />
      ) : (
        <VerifyCode
          text={`Enviamos um código de verificação para ${email}. Por favor, verifique sua caixa de entrada.`}
          context="signUp"
          onSuccess={handleVerificationSuccess}
        />
      )}
    </div>
  )
}
