"use client"

import { useSignIn, useSignUp, useUser } from "@clerk/nextjs"

export type SignInParams = {
  email: string
  password: string
  redirectUrl?: string
}

export type VerifyCodeParams = {
  code: string
}

export type SendVerificationParams = {
  email: string
  strategy: "email_code"
}

export const useAuth = () => {
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()
  const { user } = useUser()

  return {
    signInWithEmailPassword: async ({ email, password, redirectUrl }: SignInParams) => {
      try {
        const res = await signIn?.create({
          identifier: email,
          password,
        })

        const { status, createdSessionId } = res || {}

        if (status === "complete" && createdSessionId) {
          if (redirectUrl) {
            window.location.href = redirectUrl
          }
          return { success: true }
        }

        return { success: false, status }
      } catch (error) {
        console.error("Erro ao fazer login:", error)
        return { success: false, error }
      }
    },

    sendVerificationEmail: async ({ email }: SendVerificationParams) => {
      try {
        const res = await signIn?.create({
          identifier: email,
          strategy: "email_code",
        })

        const { status } = res || {}

        if (status === "needs_first_factor") {
          return { success: true, status }
        }

        return { success: false, status }
      } catch (error) {
        console.error("Erro ao enviar código de verificação:", error)
        return { success: false, error }
      }
    },

    verifyCode: async ({ code, context = 'signIn' }: VerifyCodeParams & { context?: 'signIn' | 'signUp' }) => {
      try {
        let result;

        if (context === 'signUp' && signUp) {
          result = await signUp.attemptEmailAddressVerification({ code });

          if (result.status === "complete") {
            return { success: true };
          }
        } else if (signIn) {
          result = await signIn.attemptFirstFactor({
            strategy: "email_code",
            code,
          });

          if (result.status === "complete" && result.createdSessionId) {
            return { success: true };
          }
        }

        return {
          success: false,
          status: result?.status,
          error: "Falha na verificação do código"
        };
      } catch (error: unknown) {
        console.error("Erro ao verificar código:", error);
        return {
          success: false,
          error: (error as Error).message || "Erro desconhecido na verificação do código",
          status: signIn?.status,
        };
      }
    },

    signUpWithEmailPassword: async ({ email, password, username, displayName }: {
      email: string
      password: string
      username: string
      displayName: string
    }) => {
      try {
        if (!signUp) {
          throw new Error("SignUp not initialized")
        }

        await signUp.create({
          emailAddress: email,
          password,
          username,
          firstName: displayName,
        })

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        })

        return { success: true }
      } catch (error: any) {
        console.error("Erro no registro:", error)
        return {
          success: false,
          error: error.errors?.[0]?.message || "Erro desconhecido no registro"
        }
      }
    },

    getSignInStatus: () => {
      return {
        status: signIn?.status,
        firstFactorVerification: signIn?.firstFactorVerification,
      }
    },

    getCurrentUserId: () => {
      return user?.id
    },

    getSignUpData: () => {
      return {
        status: signUp?.status,
        userId: signUp?.createdUserId,
      };
    },
  }
}
