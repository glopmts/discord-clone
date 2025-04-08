export default function DasherboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}