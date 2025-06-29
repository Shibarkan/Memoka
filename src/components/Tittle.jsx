import { GalleryHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const Tittle = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="w-full text-center my-8"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-pink-600 flex items-center justify-center gap-2">
        <GalleryHorizontal className="w-8 h-8" />
        Gallery
      </h1>
    </motion.div>
  );
};

export default Tittle;
