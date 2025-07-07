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
      } = supabase.storage.from("gallery-bucket").getPublicUrl(filePath);

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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100"
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="w-full h-40 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition"
                >
                  <p className="text-pink-500 font-semibold mb-1">
                    Upload Gambar
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    Klik untuk memilih atau drag & drop
                  </p>
                  <p className="text-xs text-gray-300">
                    Format PNG, JPG, JPEG (max 5MB)
                  </p>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {preview && (
                <div className="w-full h-40 rounded-xl overflow-hidden shadow-md border">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <input
                type="text"
                placeholder="Keterangan (opsional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-pink-400 outline-none shadow-sm"
              />

              <button
                type="submit"
                disabled={uploading}
                aria-label="upload modal"
                className={`w-full ${
                  uploading
                    ? "bg-pink-300 cursor-not-allowed"
                    : "bg-pink-500 hover:bg-pink-600"
                } text-white rounded-xl p-2 flex items-center justify-center gap-2 transition shadow-md`}
              >
                <Upload size={16} />
                {uploading ? "Mengupload..." : "Upload"}
              </button>
            </form>

            <hr className="my-4" />

            <div className="space-y-2">
              <p className="text-sm bg-pink-200">
                🎟️ <strong  >Kode Gallery Kamu:</strong> {currentCode}
              </p>

              {!isFriendGallery ? (
                <form onSubmit={handleJoin} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Masukkan kode gallery teman untuk bergabung"
                    value={friendCode}
                    onChange={(e) => setFriendCode(e.target.value)}
                    className="flex-1 border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-800 text-white rounded p-2 px-3 transition"
                    title="Gabung ke gallery teman"
                  >
                    <Users size={16} />
                    <span className="text-sm">Gabung</span>
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
