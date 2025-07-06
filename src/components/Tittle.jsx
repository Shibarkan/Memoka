import { BookHeart } from "lucide-react";
import { motion } from "framer-motion";

const Title = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full text-center my-12"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-40 h-40 bg-pink-400 blur-3xl opacity-30 rounded-full animate-pulse"></div>
      </div>

      {/* Glassmorphism Title */}
      <div className="relative z-10 inline-flex items-center gap-3 px-6 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
        <BookHeart className="w-8 h-8 text-pink-500 drop-shadow" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500">
          My Gallery
        </h1>
      </div>
    </motion.div>
  );
};

export default Title;
