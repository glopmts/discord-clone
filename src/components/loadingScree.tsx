import Image from "next/image";

const LoadingScreen = () => {
  return (
    <div className="w-full h-screen z-[999]">
      <div className="flex items-center justify-center w-full h-full">
        <Image src="/icons/animete-discord.gif" alt="animete logo" width={150} height={150} sizes="100vw" />
      </div>
    </div>
  );
}

export default LoadingScreen;