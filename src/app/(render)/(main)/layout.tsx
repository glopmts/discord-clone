"use client"

import Header from "@/components/header"
import SiderBarInfors from "@/components/servers/sideBar-infors-server"
import SideBarServes from "@/components/servers/sideBar-servers"
import ProfileHeader from "@/components/user/profile-header"
import { useAuth } from "@clerk/nextjs"
import type React from "react"

export default function DasherboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = useAuth();


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
