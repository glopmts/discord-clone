import { auth as clerkAuth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const authService = {
  getCurrentUser: async () => {
    return await currentUser();
  },

  isAuthenticated: async () => {
    const session = clerkAuth();
    return !!(await session).userId;
  },

  requireAuth: async () => {
    const session = clerkAuth();
    if (!(await session).userId) {
      redirect("/login");
    }
  },

  redirectIfAuthenticated: async (redirectUrl: string = "/channels") => {
    const session = clerkAuth();
    if ((await session).userId) {
      redirect(redirectUrl);
    }
  },
};
