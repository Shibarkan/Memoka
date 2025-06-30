import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heartImg from "../assets/image.png"; // Pastikan path benar

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);
  const MAX_HEARTS = 20;

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const createHeart = () => {
    if (hearts.length >= MAX_HEARTS) return;

    const id = Date.now() + Math.random();
    const heart = {
      id,
      left: Math.random() * windowSize.width,
      size: Math.random() * 30 + 20,
      rotateDirection: Math.random() > 0.5 ? 1 : -1,
      scale: 0.6 + Math.random() * 0.8,
      duration: 3 + Math.random() * 2,
    };
    setHearts((prev) => [...prev, heart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== heart.id));
    }, heart.duration * 1000);
  };

  useEffect(() => {
    const interval = setInterval(createHeart, 600); // ganti 1000 jika ingin lebih ringan
    return () => clearInterval(interval);
  }, [hearts, windowSize]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.img
            key={heart.id}
            src={heartImg}
            alt="heart"
            initial={{ y: windowSize.height, opacity: 1, rotate: 0 }}
            animate={{
              y: -100,
              opacity: 0,
              rotate: heart.rotateDirection * 45,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: heart.duration, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: heart.left,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              transform: `scale(${heart.scale})`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};


export default FloatingHearts;
