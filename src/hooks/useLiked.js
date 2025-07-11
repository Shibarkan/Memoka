import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const useLiked = (userCode, galleryCode) => {
  const [likedImageIds, setLikedImageIds] = useState([]);

  // 🔁 Ambil daftar image_id yang sudah di-like oleh user di galeri saat ini
  useEffect(() => {
    if (!userCode || !galleryCode) return;

    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("image_id")
        .eq("user_code", userCode)
        .eq("gallery_code", galleryCode);

      if (error) {
        console.error("❌ Error fetching likes:", error.message);
        return;
      }

      setLikedImageIds(data.map((d) => d.image_id));
    };

    fetchLikes();
  }, [userCode, galleryCode]);

  // 🔢 Hitung total like pada 1 gambar
  const getLikeCount = async (imageId) => {
    const { count, error } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("image_id", imageId);

    if (error) {
      console.error("❌ Error getting like count:", error.message);
      return 0;
    }

    return count || 0;
  };

  // ❤️ Toggle Like / Unlike
  const toggleLike = async (imageId) => {
    const hasLiked = likedImageIds.includes(imageId);

    if (!userCode || !galleryCode || !imageId) return;

    if (hasLiked) {
      // 🔁 Batalkan like
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_code", userCode)
        .eq("image_id", imageId)
        .eq("gallery_code", galleryCode);

      if (error) {
        console.error("❌ Error unliking:", error.message);
        return;
      }

      setLikedImageIds((prev) => prev.filter((id) => id !== imageId));
      return "unliked";
    } else {
      // ❤️ Beri like baru
      const { error } = await supabase.from("likes").insert([
        {
          user_code: userCode,
          gallery_code: galleryCode,
          image_id: imageId,
        },
      ]);

      if (error) {
        console.error("❌ Error liking:", error.message);
        return;
      }

      setLikedImageIds((prev) => [...prev, imageId]);
      return "liked";
    }
  };

  return {
    likedImageIds,
    getLikeCount,
    toggleLike,
  };
};
