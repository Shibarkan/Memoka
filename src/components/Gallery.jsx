import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import GalleryItem from "./GalleryItem";
import DeleteConfirm from "./DeleteConfirm";

const Gallery = ({
  code,
  isFriendGallery,
  galleryItems,
  handleEdit,
  handleDelete,
}) => {
  const [editId, setEditId] = useState(null);
  const [newDesc, setNewDesc] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showHint, setShowHint] = useState(false);

  // 🔥 Toggle delete mode
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedItems([]);
    setShowHint(!deleteMode);
  };

  // 🔥 Pilih gambar untuk dihapus
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setShowHint(false);
  };

  // 🔥 Konfirmasi hapus
  const confirmDelete = () => {
    handleDelete(selectedItems);
    setSelectedItems([]);
    setDeleteMode(false);
    setShowHint(false);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-3 mb-24">
      {/* Tombol Delete */}
      {!isFriendGallery && (
        <button
          onClick={toggleDeleteMode}
          aria-label="delete mode activatea"
          className={`fixed bottom-24 right-4 z-50 p-3 rounded-full shadow-lg 
            ${
              deleteMode
                ? "bg-red-500 hover:bg-red-600"
                : "bg-neutral-700 hover:bg-neutral-800"
            } text-white hover:scale-110 transition`}
        >
          <Trash2 /> 
        </button>
      )}

      {/* HINT */}
      {deleteMode && selectedItems.length === 0 && (
        <div className="fixed bottom-36 left-5 bg-white border px-4 py-2 rounded-xl shadow-xl z-50">
          <p className="text-sm text-pink-600 animate-slide-in">
            📌 Ketuk foto untuk dihapus
          </p>
        </div>
      )}

      {/* Pop-up Delete */}
      <AnimatePresence>
        {deleteMode && selectedItems.length > 0 && (
          <DeleteConfirm
            selectedItems={selectedItems}
            handleDelete={confirmDelete}
            toggleDeleteMode={toggleDeleteMode}
          />
        )}
      </AnimatePresence>



      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {galleryItems.map((item, i) => (
          <GalleryItem
            key={item.id}
            item={item}
            i={i}
            isFriendGallery={isFriendGallery}
            editId={editId}
            setEditId={setEditId}
            newDesc={newDesc}
            setNewDesc={setNewDesc}
            handleEdit={handleEdit}
            deleteMode={deleteMode}
            toggleSelect={toggleSelect}
            selectedItems={selectedItems}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
