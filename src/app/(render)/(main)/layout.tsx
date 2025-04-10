"use client"

import Header from "@/components/header"
import ProfileHeader from "@/components/profile-header"
import SiderBarInfors from "@/components/sider-bar-infors"
import SideBarServes from "@/components/sider-bar-servers"
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
      <Header userId={userId} />
      <div className="flex relative flex-1 w-full overflow-hidden">
        <ProfileHeader userId={userId} />
        <SideBarServes />
        <SiderBarInfors />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
