import { useRef, useState } from "react";
import { X, Upload, Users } from "lucide-react";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const UploadModal = ({
  isOpen,
  setIsOpen,
  currentCode,
  handleUpload,
  handleJoinGallery,
  isFriendGallery,
  exitFriendGallery,
}) => {
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [friendCode, setFriendCode] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileRef.current.files[0];
    if (!file) return alert("Pilih gambar dulu.");

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${currentCode}/${fileName}`;

      // Upload ke Storage
      const { error: uploadError } = await supabase.storage
        .from("gallery-bucket")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Dapatkan public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("gallery-bucket")
        .getPublicUrl(filePath);

      // Simpan metadata ke DB
      const { data, error: dbError } = await supabase
        .from("galleries")
        .insert([
          {
            user_code: currentCode,
            image_url: publicUrl,
            description,
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      handleUpload(data);
      setPreview(null);
      setDescription("");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Gagal upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!friendCode) return;
    handleJoinGallery(friendCode);
    setIsOpen(false);
    setFriendCode("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => {
            if (!uploading) setIsOpen(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg relative"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-neutral-500 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4">Tambah Foto</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleFileChange}
                className="w-full border rounded p-2"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <input
                type="text"
                placeholder="Keterangan (opsional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded p-2"
              />
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded p-2 flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                {uploading ? "Mengupload..." : "Upload"}
              </button>
            </form>

            <hr className="my-4" />

            <div className="space-y-2">
              <p className="text-sm">
                🎟️ <strong>Kode Gallery Kamu:</strong> {currentCode}
              </p>

              {!isFriendGallery ? (
                <form onSubmit={handleJoin} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Kode gallery teman"
                    value={friendCode}
                    onChange={(e) => setFriendCode(e.target.value)}
                    className="flex-1 border rounded p-2"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-700 hover:bg-neutral-800 text-white rounded p-2"
                  >
                    <Users size={16} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={exitFriendGallery}
                  className="w-full bg-neutral-700 hover:bg-neutral-800 text-white rounded p-2"
                >
                  Keluar dari gallery teman
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
