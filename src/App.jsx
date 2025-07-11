import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

import UploadModal from "./components/UploadModal";
import Gallery from "./components/Gallery";
import MusicPlayer from "./components/MusicPlayer";
import FriendGalleryBanner from "./components/FriendGalleryBanner";
import Tittle from "./components/Tittle";
import FloatingHearts from "./components/FloatingHearts";
import Alert from "./components/Alert";

import { useGallery } from "./hooks/useGallery";
import BackgroundImg from "./assets/bg.WebP";

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
      className="min-h-screen w-full bg-cover bg-center bg-fixed bg-no-repeat overflow-x-hidden"
      style={{ backgroundImage: `url(${BackgroundImg})` }}
    >
      <Tittle />

      {/* 🔍 Banner saat masuk galeri teman */}
      {isFriendGallery && (
        <FriendGalleryBanner
          currentCode={currentCode}
          exitFriendGallery={exitFriendGallery}
        />
      )}

      {/* Tombol Upload */}
      {!isFriendGallery && (
        <button
          onClick={() => setIsUploadOpen(true)}
          className="fixed bottom-7 right-4 z-50 p-3 rounded-full shadow-lg bg-pink-500 hover:bg-pink-600 text-white hover:scale-110 transition"
        >
          <Upload size={20} />
        </button>
      )}

      {/* Pemutar Musik */}
      <MusicPlayer />

      {/* Modal Upload */}
      <UploadModal
        isOpen={isUploadOpen}
        setIsOpen={setIsUploadOpen}
        currentCode={currentCode}
        handleUpload={handleUpload}
        handleJoinGallery={handleJoinGallery}
        isFriendGallery={isFriendGallery}
        exitFriendGallery={exitFriendGallery}
      />

      {/* Galeri */}
      <Gallery
        code={currentCode}
        isFriendGallery={isFriendGallery}
        galleryItems={galleryItems}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Floating & Toaster */}
      <FloatingHearts />
      <Toaster position="top-center" />
      <Alert />
    </div>
  );
}

export default App;
