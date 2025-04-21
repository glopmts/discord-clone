"use server";

import { db } from "@/lib/db";

export async function createUser(userData: {
  clerk_id: string
  email?: string
  name?: string
  username?: string
  image?: string
  dateNce?: Date
  marketingEmails?: boolean
}) {
  try {
    const existingUser = await db.user.findUnique({
      where: {
        clerk_id: userData.clerk_id,
      },
    })

    if (existingUser) {
      return { success: false, error: "Usuário já existe" }
    }

    const newUser = await db.user.create({
      data: userData,
    })

    return { success: true, user: newUser }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, error: "Falha ao criar usuário" }
  }
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  if (!username || username.length < 3) return false

  try {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true }
    })
    return !!user
  } catch (error) {
    console.error("Database error:", error)
    return false
  }
}