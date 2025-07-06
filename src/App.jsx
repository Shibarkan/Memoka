import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Ticket, Upload } from "lucide-react";

import UploadModal from "./components/UploadModal";
import Gallery from "./components/Gallery";
import MusicPlayer from "./components/MusicPlayer";
import FriendGalleryBanner from "./components/FriendGalleryBanner";
import Tittle from "./components/Tittle";
import FloatingHearts from "./components/FloatingHearts";
import Alert from "./components/Alert";

import { useGallery } from "./hooks/useGallery";
import bg from "./assets/bg.WebP";

function App() {
  const {
    galleryItems,
    setGalleryItems,
    currentCode,
    isFriendGallery,
    handleUpload,
    handleEdit,
    handleDelete,
    handleJoinGallery,
    exitFriendGallery,
  } = useGallery();

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    if (isFriendGallery) {
      toast.success("Berhasil masuk ke gallery teman!");
    }
  }, [isFriendGallery]);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Tittle />
      {/* 🔍 Banner kalau lagi liat gallery teman */}
      {isFriendGallery && (
        <FriendGalleryBanner
          currentCode={currentCode}
          exitFriendGallery={exitFriendGallery}
        />
      )}

      {/*  Upload Button */}
      {!isFriendGallery && (
        <button
          onClick={() => setIsUploadOpen(true)}
          className="fixed bottom-7 right-4 z-50 p-3 rounded-full shadow-lg bg-pink-500 hover:bg-pink-600 text-white hover:scale-110 transition"
        >
          <Upload size={20} />
        </button>
      )}

      {/*  Music Button */}
      <MusicPlayer />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        setIsOpen={setIsUploadOpen}
        currentCode={currentCode}
        handleUpload={handleUpload}
        handleJoinGallery={handleJoinGallery}
        isFriendGallery={isFriendGallery}
        exitFriendGallery={exitFriendGallery}
      />

      {/* 🖼️ Gallery */}
      <Gallery
        code={currentCode}
        isFriendGallery={isFriendGallery}
        galleryItems={galleryItems}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* 📜 Footer */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold flex items-center gap-1"
      >
        <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
          © 2025 Memoka • Lovely Gallery
        </span>
      </motion.div>

      <FloatingHearts />
      <Toaster position="top-center" />
      <Alert/>
    </div>
  );
}

export default App;
