"use client"

import Header from "@/components/Header"
import SideBarServes from "@/components/servers/ServerList"
import SiderBarInfors from "@/components/servers/ServerViewManager"
import ProfileHeader from "@/components/user/ProfileBottom"
import { useSyncOnlineStatus } from "@/hooks/useUpdateOnlineStatus"
import { useAuth } from "@clerk/nextjs"

export default function DasherboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = useAuth();
  useSyncOnlineStatus()

  if (!userId) {
    return null
  }

  return (
    <div className="flex relative flex-col h-screen w-full">
      <Header />
      <div className="flex relative flex-1 w-full overflow-hidden">
        <ProfileHeader userId={userId} />
        <SideBarServes userId={userId} />
        <SiderBarInfors userId={userId} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}