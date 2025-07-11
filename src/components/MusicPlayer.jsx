import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import { useUserCode } from "../hooks/useUserCode";
import { useFavorites } from "../hooks/useFavorites";

import musicPlay from "../assets/musicPlay.WebP";
import MusicTabs from "./controlmusic/MusicTabs";
import MusicUploader from "./controlmusic/MusicUploader";
import MusicList from "./controlmusic/MusicList";
import MusicControls from "./controlmusic/MusicControls";
import WaveformVisualizer from "./controlmusic/Waveform";

const MusicPlayer = () => {
  const [show, setShow] = useState(false);
  const [musicList, setMusicList] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tab, setTab] = useState("default");
  const userCode = useUserCode();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  const audioRef = useRef(null);

  const fetchMusic = async () => {
    try {
      if (tab === "default") {
        const { data, error } = await supabase.storage
          .from("music-bucket")
          .list("", { limit: 100 });

        if (error) throw error;

        const urls = data.map((file) => ({
          name: file.name,
          src: supabase.storage.from("music-bucket").getPublicUrl(file.name)
            .data.publicUrl,
        }));

        setMusicList(urls);
      } else {
        if (!userCode) return;

        const { data, error } = await supabase.storage
          .from("user-music-bucket")
          .list(userCode, { limit: 100 });

        if (error) throw error;

        const urls = data.map((file) => ({
          name: file.name,
          src: supabase.storage
            .from("user-music-bucket")
            .getPublicUrl(`${userCode}/${file.name}`).data.publicUrl,
        }));

        setMusicList(urls);
      }
    } catch (error) {
      console.error("Fetch music error:", error.message);
      toast.error("Gagal memuat lagu");
    }
  };

  useEffect(() => {
    fetchMusic();
  }, [tab, userCode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      const currentIndex = musicList.findIndex(
        (item) => item.name === current?.name
      );
      const nextIndex = (currentIndex + 1) % musicList.length;
      const nextSong = musicList[nextIndex];
      setCurrent(nextSong);
      setTimeout(() => {
        audioRef.current?.play();
        setIsPlaying(true);
      }, 100);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [current, musicList]);

  const handlePlay = () => {
    if (!current && musicList.length > 0) {
      setCurrent(musicList[0]);
      setTimeout(() => {
        audioRef.current?.play();
        setIsPlaying(true);
      }, 100);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handleSelect = (track) => {
    setCurrent(track);
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userCode) return;

    const filePath = `${userCode}/${file.name}`;
    try {
      const { error } = await supabase.storage
        .from("user-music-bucket")
        .upload(filePath, file, { upsert: true });
      if (error) throw error;

      await fetchMusic();
      toast.success("Lagu berhasil di-upload!");
    } catch (error) {
      console.error("Upload error:", error.message);
      toast.error("Gagal upload lagu.");
    }
  };

  const handleDelete = async (song) => {
    if (!userCode || !song?.name) return;

    const filePath = `${userCode}/${song.name}`;

    try {
      // 1. Cek apakah file ada dulu (optional tapi aman)
      const { data: checkData, error: checkError } = await supabase.storage
        .from("user-music-bucket")
        .list(userCode);

      const fileExists = checkData?.some((file) => file.name === song.name);
      if (!fileExists) {
        toast.error("File tidak ditemukan di storage");
        return;
      }

      // 2. Hapus file
      const { error } = await supabase.storage
        .from("user-music-bucket")
        .remove([filePath]);

      if (error) throw error;

      // 3. Ambil ulang lagu user biar sync
      const { data: newData, error: reloadError } = await supabase.storage
        .from("user-music-bucket")
        .list(userCode, { limit: 100 });

      if (reloadError) throw reloadError;

      const updatedList = newData.map((file) => ({
        name: file.name,
        src: supabase.storage
          .from("user-music-bucket")
          .getPublicUrl(`${userCode}/${file.name}`).data.publicUrl,
      }));

      setMusicList(updatedList);

      // 4. Hentikan jika file yang dihapus sedang diputar
      if (current?.name === song.name) {
        setCurrent(null);
        setIsPlaying(false);
      }

      toast.success("Lagu berhasil dihapus dari bucket");
    } catch (err) {
      console.error("Delete error:", err.message);
      toast.error("Gagal menghapus file dari storage");
    }
  };

  const cleanFileName = (filename) =>
    filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .trim();

  return (
    <>
      <div
        className={`fixed bottom-5 left-5 z-50 border border-pink-300 w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition hover:scale-105 ${
          show ? "bg-pink-200" : "bg-white"
        }`}
        onClick={() => setShow(!show)}
      >
        <img
          src={musicPlay}
          alt="Music"
          className={`w-6 h-6 ${isPlaying ? "animate-spin" : ""}`}
        />
      </div>

      <AnimatePresence>
        {show && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShow(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed bottom-20 left-5 z-50 bg-white rounded-xl p-4 w-72 shadow-xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <MusicTabs tab={tab} setTab={setTab} />
              {tab === "user" && <MusicUploader onUpload={handleUpload} />}
              <MusicList
                musicList={musicList}
                current={current}
                onSelect={handleSelect}
                onConfirmDelete={setConfirmDelete}
                tab={tab}
                cleanFileName={cleanFileName}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />

              <MusicControls
                current={current}
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
                cleanFileName={cleanFileName}
                progress={progress}
                setProgress={setProgress}
                audioRef={audioRef}
              />
              {tab === "user" && current && (
                <WaveformVisualizer audioRef={audioRef} />
              )}
            </motion.div>

            {confirmDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white p-4 rounded-xl shadow-xl text-center space-y-4 w-64">
                  <p className="text-sm text-gray-700 font-semibold">
                    Yakin ingin menghapus lagu ini?
                  </p>
                  <p className="text-pink-500 text-sm truncate">
                    {cleanFileName(confirmDelete.name)}
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        handleDelete(confirmDelete);
                        setConfirmDelete(null);
                      }}
                      className="px-4 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm"
                    >
                      Ya
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-4 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </AnimatePresence>

      {current && <audio ref={audioRef} src={current.src} />}
    </>
  );
};

export default MusicPlayer;
