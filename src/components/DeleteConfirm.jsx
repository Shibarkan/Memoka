import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useState } from "react";

const DeleteConfirm = ({ selectedItems, handleDelete, toggleDeleteMode }) => {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    if (!confirming) {
      setConfirming(true);
    } else {
      handleDelete();
      setConfirming(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-40 left-5 z-50 bg-white border px-4 py-3 rounded-xl shadow-xl flex gap-3 items-center"
    >
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-pink-600">
          {confirming
            ? `Yakin ingin menghapus ${selectedItems.length} item?`
            : `${selectedItems.length} item terpilih`}
        </p>

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleConfirm}
            className={`${
              confirming
                ? "bg-pink-500 hover:bg-pink-600"
                : "bg-pink-500 hover:bg-pink-300"
            } text-white px-4 py-1 rounded flex items-center gap-1`}
          >
            <Check size={16} />
            {confirming ? "Ya, hapus" : "Hapus"}
          </button>

          <button
            onClick={() => {
              if (confirming) setConfirming(false);
              else toggleDeleteMode();
            }}
            className="bg-pink-500 px-4 py-1 rounded hover:bg-pink-300 flex items-center gap-1"
          >
            <X size={16} />
            {confirming ? "Batal" : "Tutup"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DeleteConfirm;
