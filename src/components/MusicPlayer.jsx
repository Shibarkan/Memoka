import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import playIcon from "../assets/play.png";
import pauseIcon from "../assets/pause.png";
import musicPlay from "../assets/musicPlay.png";

const MusicPlayer = () => {
  const [show, setShow] = useState(false);
  const [musicList, setMusicList] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);

  // ✅ Fetch daftar musik dari Supabase
  useEffect(() => {
    const fetchMusic = async () => {
      const { data, error } = await supabase.storage
        .from("music-bucket")
        .list("", { limit: 100 });

      if (error) {
        console.error("Error fetching music:", error.message);
        return;
      }

      const urls = data.map((file) => ({
        name: file.name,
        src: supabase.storage.from("music-bucket").getPublicUrl(file.name).data
          .publicUrl,
      }));

      setMusicList(urls);
    };

    fetchMusic();
  }, []);

  // ▶️ Play
  const handlePlay = () => {
    if (!current && musicList.length > 0) {
      const first = musicList[0];
      setCurrent(first);
      setTimeout(() => {
        audioRef.current?.play();
        setIsPlaying(true);
      }, 100);
    } else if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // ⏸ Pause
  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  // 🔁 Select Lagu
  const handleSelect = (track) => {
    setCurrent(track);
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  // ⏩ Update Progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [current]);

  // ⏭️ Auto Next Ketika Lagu Selesai
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
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [current, musicList]);

  const handleOverlayClick = () => setShow(false);

  // 🔤 Format nama file
  const cleanFileName = (filename) => {
    return filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .trim();
  };

  return (
    <>
      {/* 🔘 Tombol Musik */}
      <div
        className={`fixed bottom-5 left-5 z-50 border border-pink-300 w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition hover:scale-105 ${
          show ? "bg-pink-200" : "bg-white"
        }`}
        onClick={() => setShow(!show)}
      >
        <img
          src={musicPlay}
          alt="Music"
          className={`w-7 h-7 ${isPlaying ? "animate-spin" : ""}`}
        />
      </div>

      {/* 🟦 Overlay */}
      <AnimatePresence>
        {show && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={handleOverlayClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>

            {/* 🪟 Popup */}
            <motion.div
              className="fixed bottom-20 left-5 z-50 bg-white rounded-xl p-4 w-72 shadow-xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-pink-600 font-semibold">Pilih Lagu</h3>
                <button onClick={() => setShow(false)}>
                  <X className="text-gray-500 hover:text-red-500" />
                </button>
              </div>

              {/* 📜 List Lagu */}
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 text-sm">
                {musicList.map((song) => (
                  <li
                    key={song.name}
                    className={`cursor-pointer px-2 py-1 rounded ${
                      current?.name === song.name
                        ? "bg-pink-100"
                        : "hover:bg-pink-50"
                    }`}
                    onClick={() => handleSelect(song)}
                  >
                    {cleanFileName(song.name)}
                  </li>
                ))}
              </ul>

              {/* 🎚️ Music Player Bar */}
              <div className="mt-4 border-t pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    <img
                      src={isPlaying ? pauseIcon : playIcon}
                      alt="PlayPause"
                      className="w-6 h-6"
                    />
                  </button>
                  <span className="text-gray-700 text-sm truncate">
                    {current ? cleanFileName(current.name) : "Belum ada lagu"}
                  </span>
                </div>

                {/* 🚀 Progress Bar Stylish */}
                <div className="relative w-full h-3 rounded-full bg-gray-800 shadow-inner overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      boxShadow: `0 0 8px rgba(219,39,119,0.6)`,
                    }}
                  ></div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => {
                      const seek =
                        (audioRef.current.duration * e.target.value) / 100;
                      audioRef.current.currentTime = seek;
                      setProgress(Number(e.target.value));
                    }}
                    className="absolute inset-0 w-full h-full appearance-none cursor-pointer opacity-0"
                  />

                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 hover:scale-125"
                    style={{ left: `calc(${progress}% - 10px)` }}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🔊 Audio */}
      {current && <audio ref={audioRef} src={current.src} />}
    </>
  );
};

export default MusicPlayer;
