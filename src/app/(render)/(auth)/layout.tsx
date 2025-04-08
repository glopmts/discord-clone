import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full px-6 py-4" style={{ backgroundImage: "url('/images/backgroundAuth.svg')", backgroundSize: 'cover' }}>
        <div className="flex items-center gap-2">
          <Image src="/images/discord-white.png" alt="Logo" width={40} height={40} />
          <h2 className="font-semibold text-xl">Discord Clone</h2>
        </div>
        {children}
      </div>
    </div>
  )
}