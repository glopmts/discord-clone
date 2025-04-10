"use client";

import { useAuth } from "@clerk/nextjs";

const Channels = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col dark:bg-[#003596b00]">
      <span>flex flex-col items-center justify-center</span>
    </div>
  );
}

export default Channels;