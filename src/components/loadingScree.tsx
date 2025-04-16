import { motion } from "framer-motion";
import Image from "next/image";

const LoadingScreen = () => {
  return (
    <motion.div
      className="w-full h-screen z-[999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <motion.div
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src="/icons/animete-discord.gif"
            alt="animete logo"
            width={150}
            height={150}
            sizes="100vw"
            unoptimized
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default LoadingScreen;