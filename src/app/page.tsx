"use client";

import LoadingScreen from "@/components/loadingScree";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isLoader, setLoader] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const minimumLoadTime = 3000;

    const timer = setTimeout(() => {
      if (!user) {
        router.push("/login");
      } else {
        router.push("/channels/me");
      }
      setLoader(false);
    }, minimumLoadTime);

    return () => clearTimeout(timer);
  }, [user, isLoaded, router]);

  if (isLoader) {
    return (
      <div className="w-full h-full">
        <LoadingScreen />
      </div>
    );
  }

  return null;
}