import { useState, useEffect } from "react";
import { Pencil, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, randomRotation } from "../utils/utils";
import { useLiked } from "../hooks/useLiked";
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

  const userCode = localStorage.getItem("memoka_user_code");
  const galleryCode = isFriendGallery
    ? localStorage.getItem("memoka_friend_code")
    : userCode;

  const { likedImageIds, getLikeCount, toggleLike } = useLiked(
    userCode,
    galleryCode
  );
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const count = await getLikeCount(item.id);
      setLikeCount(count);
    };
    fetch();
  }, [item.id]);

  const hasLiked = likedImageIds.includes(item.id);

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
      {/* Gambar */}
      <img
        src={item.image_url}
        alt="img"
        className="w-full h-48 object-cover rounded-lg mb-1"
      />

      {/* Edit & Deskripsi */}
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
              {item.description || <i className="text-neutral-400"><br /></i>}
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

      {/* ❤️ Tombol Like */}
      <button
        onClick={async (e) => {
          e.stopPropagation();
          const result = await toggleLike(item.id);
          if (result === "liked") setLikeCount((prev) => prev + 1);
          if (result === "unliked") setLikeCount((prev) => prev - 1);
        }}
        className={`mt-2 text-sm flex items-center gap-1 transition ${
          hasLiked ? "text-pink-600" : "text-neutral-400"
        }`}
      >
        <Heart fill={hasLiked ? "#ec4899" : "none"} className="w-5 h-5" />
        <span>{likeCount}</span>
      </button>
    </motion.div>
  );
};

export default GalleryItem;
