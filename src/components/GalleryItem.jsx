import { Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { randomRotation, formatDate } from "../utils/utils";
import EditInput from "./EditInput";

const GalleryItem = ({
  item,
  i,
  isFriendGallery,
  editId,
  setEditId,
  newDesc,
  setNewDesc,
  handleEdit,
  deleteMode,
  toggleSelect,
  selectedItems,
}) => {
  const isSelected = selectedItems.includes(item.id);
  const rotation = randomRotation();

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      whileHover={{ scale: 1.05 }}
      transition={{ delay: i * 0.05 }}
      className={`relative bg-white border border-neutral-200 rounded-xl shadow-md p-2 ${
        deleteMode ? "animate-wiggle cursor-pointer" : ""
      } ${isSelected ? "opacity-60 ring-4 ring-pink-400" : ""}`}
      onClick={() => {
        if (deleteMode) toggleSelect(item.id);
      }}
    >
      <div className="relative">
        <img
          src={item.image_url}
          alt="img"
          className="w-full h-48 object-cover rounded-lg mb-1"
        />
      </div>

      {editId === item.id ? (
        <EditInput
          item={item}
          newDesc={newDesc}
          setNewDesc={setNewDesc}
          handleEdit={() => handleEdit(item, newDesc)}
          setEditId={setEditId}
        />
      ) : (
        <div className="mt-1 flex justify-between items-start">
          <div>
            <p className="text-sm text-neutral-700">
              {item.description || (
                <i className="text-neutral-400">Tanpa keterangan</i>
              )}
            </p>
            <div className="text-xs text-neutral-400">
              {formatDate(item.created_at)}
            </div>
          </div>
          {!isFriendGallery && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditId(item.id);
                setNewDesc(item.description || "");
              }}
              className="bg-white p-1 rounded-full shadow hover:bg-pink-100 self-end"
            >
              <Pencil size={16} className="text-pink-500" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default GalleryItem;
