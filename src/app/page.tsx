"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/login");
    } else {
      router.push("/channels/me");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Image src="/icons/animete-discord.gif" alt="Loading..." width={100} height={100} sizes="100vw" />
      </div>
    );
  }

  return null;
}
