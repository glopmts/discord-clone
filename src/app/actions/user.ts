"use server"

import { db } from "@/lib/db"

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

export async function getUserById(userId: string) {
  try {
    return await db.user.findUnique({
      where: {
        id: userId,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return null
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    return await db.user.findUnique({
      where: {
        clerk_id: clerkId,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar usuário por Clerk ID:", error)
    return null
  }
}

export async function getUserDetails(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required!")
    }

    const user = await db.user.findUnique({
      where: {
        clerk_id: userId,
      },
      include: {
        Message: true,
        channels: true,
        Server: true,
      },
    })

    if (!user) {
      throw new Error("User not found!")
    }

    return user
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }
    throw new Error("Failed to fetch user")
  }
}


export async function updateUser(userData: {
  userId: string
  name?: string
  username?: string
  image?: string
}) {
  try {
    if (!userData.userId) {
      throw new Error("User ID is required!")
    }

    const userIdentific = await db.user.findUnique({
      where: {
        clerk_id: userData.userId,
      },
    })

    if (!userIdentific) {
      throw new Error("User not found!")
    }

    const update = await db.user.update({
      where: {
        clerk_id: userData.userId
      },
      data: {
        name: userData.name,
        username: userData.username,
        image: userData.image || "",
      }
    })

    return update
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed update user: ${error.message}`)
    }
    throw new Error("Failed update user")
  }
}
