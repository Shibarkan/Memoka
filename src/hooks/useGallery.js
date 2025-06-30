import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "react-hot-toast";

export const useGallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [currentCode, setCurrentCode] = useState(null);
  const [isFriendGallery, setIsFriendGallery] = useState(false);

  // 🚀 Load kode dari localStorage
  useEffect(() => {
    const myCode = getMyCode();
    const friendCode = localStorage.getItem("memoka_friend_code");

    if (friendCode) {
      setCurrentCode(friendCode);
      setIsFriendGallery(true);
      fetchGallery(friendCode);
    } else {
      setCurrentCode(myCode);
      setIsFriendGallery(false);
      fetchGallery(myCode);
    }
  }, []);

  const getMyCode = () => {
    let code = localStorage.getItem("memoka_user_code");
    if (!code) {
      code = crypto.randomUUID().slice(0, 8);
      localStorage.setItem("memoka_user_code", code);
    }
    return code;
  };

  // 🚩 Fetch Gallery
  const fetchGallery = async (code) => {
    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .eq("user_code", code)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching gallery:", error.message);
      return;
    }

    setGalleryItems(data);
  };

  // 🔥 Upload handler
  const handleUpload = (newItem) => {
    setGalleryItems((prev) => [newItem, ...prev]);
  };

  // ✏️ Edit description
  const handleEdit = async (item, newDesc) => {
    const { error, data } = await supabase
      .from("galleries")
      .update({ description: newDesc })
      .eq("id", item.id)
      .eq("user_code", currentCode)
      .select()
      .single();

    if (error) {
      console.error("Error updating:", error.message);
      toast.error("Gagal update keterangan.");
      return;
    }

    setGalleryItems((prev) =>
      prev.map((i) => (i.id === data.id ? { ...i, description: data.description } : i))
    );
  };

  // 🗑️ Delete items
  const handleDelete = async (selectedIds) => {
    try {
      const itemsToDelete = galleryItems.filter((item) =>
        selectedIds.includes(item.id)
      );

      // Delete dari storage
      await Promise.all(
        itemsToDelete.map((item) => {
          const path = item.image_url.split("/storage/v1/object/public/gallery-bucket/")[1];
          return supabase.storage.from("gallery-bucket").remove([path]);
        })
      );

      // Delete dari database
      const { error } = await supabase
        .from("galleries")
        .delete()
        .in("id", selectedIds);

      if (error) {
        console.error("Error deleting:", error.message);
        toast.error("Gagal menghapus.");
        return;
      }

      setGalleryItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus.");
    }
  };

  // 👥 Join friend gallery dengan validasi
  const handleJoinGallery = async (friendCode) => {
    const myCode = getMyCode();

    // ❌ Cek jika kode sama dengan milik sendiri
    if (friendCode === myCode) {
      toast.error("Kamu tidak bisa membuka gallery milik sendiri!");
      return;
    }

    // 🔍 Cek apakah kode gallery teman ada
    const { data, error } = await supabase
      .from("galleries")
      .select("id")
      .eq("user_code", friendCode)
      .limit(1);

    if (error) {
      console.error("Error checking code:", error.message);
      toast.error("Terjadi kesalahan saat memeriksa kode.");
      return;
    }

    if (!data || data.length === 0) {
      toast.error("Kode tidak ditemukan. Periksa kembali.");
      return;
    }

    // ✅ Jika ada, masuk ke gallery teman
    localStorage.setItem("memoka_friend_code", friendCode);
    setIsFriendGallery(true);
    setCurrentCode(friendCode);
    fetchGallery(friendCode);
    toast.success("Berhasil masuk ke gallery teman!");
  };

  // 🔙 Exit friend gallery
  const exitFriendGallery = () => {
    localStorage.removeItem("memoka_friend_code");
    const myCode = getMyCode();
    setIsFriendGallery(false);
    setCurrentCode(myCode);
    fetchGallery(myCode);
    toast.success("Kembali ke gallery sendiri!");
  };

  return {
    galleryItems,
    setGalleryItems,
    currentCode,
    isFriendGallery,
    handleUpload,
    handleEdit,
    handleDelete,
    handleJoinGallery,
    exitFriendGallery,
    fetchGallery,
  };
};
