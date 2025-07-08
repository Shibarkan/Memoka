// import { useEffect, useState, useRef } from "react";
// import { supabase } from "../supabaseClient";
// import { X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-hot-toast";

// import { useUserCode } from "../hooks/useUserCode";

// import playIcon from "../assets/play.WebP";
// import pauseIcon from "../assets/pause.WebP";
// import musicPlay from "../assets/musicPlay.WebP";

// const MusicPlayer = () => {
//   const [show, setShow] = useState(false);
//   const [musicList, setMusicList] = useState([]);
//   const [current, setCurrent] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [tab, setTab] = useState("default"); // 'default' atau 'user'
//   const userCode = useUserCode(); // pakai hook kamu

//   const audioRef = useRef(null);

//   // Fetch lagu berdasarkan tab
//   useEffect(() => {
//     const fetchMusic = async () => {
//       try {
//         if (tab === "default") {
//           const { data, error } = await supabase.storage
//             .from("music-bucket")
//             .list("", { limit: 100 });

//           if (error) throw error;

//           const urls = data.map((file) => ({
//             name: file.name,
//             src: supabase.storage.from("music-bucket").getPublicUrl(file.name)
//               .data.publicUrl,
//           }));

//           setMusicList(urls);
//         } else {
//           if (!userCode) return;

//           const { data, error } = await supabase.storage
//             .from("user-music-bucket")
//             .list(userCode, { limit: 100 });

//           if (error) throw error;

//           const urls = data.map((file) => ({
//             name: file.name,
//             src: supabase.storage
//               .from("user-music-bucket")
//               .getPublicUrl(`${userCode}/${file.name}`).data.publicUrl,
//           }));

//           setMusicList(urls);
//         }
//       } catch (error) {
//         console.error("Fetch music error:", error.message);
//         toast.error("Gagal memuat lagu");
//       }
//     };

//     fetchMusic();
//   }, [tab, userCode]);

//   const handlePlay = () => {
//     if (!current && musicList.length > 0) {
//       setCurrent(musicList[0]);
//       setTimeout(() => {
//         audioRef.current?.play();
//         setIsPlaying(true);
//       }, 100);
//     } else {
//       audioRef.current?.play();
//       setIsPlaying(true);
//     }
//   };

//   const handlePause = () => {
//     audioRef.current?.pause();
//     setIsPlaying(false);
//   };

//   const handleSelect = (track) => {
//     setCurrent(track);
//     setTimeout(() => {
//       audioRef.current?.play();
//       setIsPlaying(true);
//     }, 100);
//   };

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const updateProgress = () => {
//       if (audio.duration) {
//         setProgress((audio.currentTime / audio.duration) * 100);
//       }
//     };

//     audio.addEventListener("timeupdate", updateProgress);
//     return () => {
//       audio.removeEventListener("timeupdate", updateProgress);
//     };
//   }, [current]);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const handleEnded = () => {
//       const currentIndex = musicList.findIndex(
//         (item) => item.name === current?.name
//       );
//       const nextIndex = (currentIndex + 1) % musicList.length;
//       const nextSong = musicList[nextIndex];
//       setCurrent(nextSong);
//       setTimeout(() => {
//         audioRef.current?.play();
//         setIsPlaying(true);
//       }, 100);
//     };

//     audio.addEventListener("ended", handleEnded);
//     return () => {
//       audio.removeEventListener("ended", handleEnded);
//     };
//   }, [current, musicList]);

//   const cleanFileName = (filename) =>
//     filename
//       .replace(/\.[^/.]+$/, "")
//       .replace(/[-_]/g, " ")
//       .trim();

//   const handleOverlayClick = () => setShow(false);

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       const userCode = localStorage.getItem("memoka_user_code");
//       if (!userCode) throw new Error("User code tidak ditemukan");

//       const filePath = `${userCode}/${file.name}`;
//       const { error } = await supabase.storage
//         .from("user-music-bucket")
//         .upload(filePath, file, { upsert: true });

//       if (error) throw error;

//       const newSong = {
//         name: file.name,
//         src: supabase.storage.from("user-music-bucket").getPublicUrl(filePath)
//           .data.publicUrl,
//       };

//       // ⏱️ Real-time update
//       setMusicList((prev) => [newSong, ...prev]);

//       toast.success("Lagu berhasil di-upload!");
//     } catch (error) {
//       console.error("Upload error:", error.message);
//       toast.error("Gagal upload lagu.");
//     }
//   };

//   const handleDelete = async (song) => {
//     const userCode = localStorage.getItem("memoka_user_code");
//     const filePath = `${userCode}/${song.name}`;

//     try {
//       const { error } = await supabase.storage
//         .from("user-music-bucket")
//         .remove([filePath]);

//       if (error) throw error;

//       setMusicList((prev) => prev.filter((m) => m.name !== song.name));
//       if (current?.name === song.name) {
//         setCurrent(null);
//         setIsPlaying(false);
//       }

//       toast.success("Lagu berhasil dihapus");
//     } catch (err) {
//       console.error("Delete error:", err.message);
//       toast.error("Gagal menghapus lagu");
//     }
//   };

//   return (
//     <>
//       {/* Tombol Musik */}
//       <div
//         className={`fixed bottom-5 left-5 z-50 border border-pink-300 w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition hover:scale-105 ${
//           show ? "bg-pink-200" : "bg-white"
//         }`}
//         onClick={() => setShow(!show)}
//       >
//         <img
//           src={musicPlay}
//           alt="Music"
//           className={`w-6 h-6 ${isPlaying ? "animate-spin" : ""}`}
//         />
//       </div>

//       {/* Popup */}
//       <AnimatePresence>
//         {show && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/30 z-40"
//               onClick={handleOverlayClick}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             />

//             <motion.div
//               className="fixed bottom-20 left-5 z-50 bg-white rounded-xl p-4 w-72 shadow-xl"
//               initial={{ opacity: 0, scale: 0.8, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.8, y: 20 }}
//               transition={{ type: "spring", stiffness: 300, damping: 20 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Tab Toggle */}
//               <div className="flex gap-2 mb-3">
//                 <button
//                   className={`px-3 py-1 rounded-full text-sm ${
//                     tab === "default" ? "bg-pink-300 text-white" : "bg-gray-200"
//                   }`}
//                   onClick={() => setTab("default")}
//                 >
//                   Default Music
//                 </button>
//                 <button
//                   className={`px-3 py-1 rounded-full text-sm ${
//                     tab === "user" ? "bg-pink-300 text-white" : "bg-gray-200"
//                   }`}
//                   onClick={() => setTab("user")}
//                 >
//                   My Music
//                 </button>
//               </div>

//               {/* Upload */}
//               {tab === "user" && (
//                 <div className="mb-2">
//                   <button
//                     onClick={() =>
//                       document.getElementById("music-upload").click()
//                     }
//                     className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full text-sm shadow transition"
//                   >
//                     <span className="text-xl font-bold">＋</span> Tambah Lagu
//                   </button>
//                   <input
//                     id="music-upload"
//                     type="file"
//                     accept="audio/*"
//                     onChange={handleUpload}
//                     className="hidden"
//                   />
//                 </div>
//               )}

//               {/* Playlist */}
//               <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 text-sm">
//                 {musicList.map((song) => (
//                   <li
//                     key={song.name}
//                     className={`group flex items-center justify-between gap-2 px-2 py-1 rounded text-sm ${
//                       current?.name === song.name
//                         ? "bg-pink-100"
//                         : "hover:bg-pink-50"
//                     }`}
//                   >
//                     <span
//                       onClick={() => handleSelect(song)}
//                       className="flex-1 truncate cursor-pointer"
//                     >
//                       {cleanFileName(song.name)}
//                     </span>

//                     {/* Tombol Hapus - hanya untuk My Music */}
//                     {tab === "user" && (
//                       <div className="mb-3">
//                         <button
//                           onClick={() =>
//                             document.getElementById("music-upload").click()
//                           }
//                           className="group inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 transition"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="lucide lucide-plus-circle w-5 h-5 group-hover:rotate-90 transition-transform"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth={2}
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <circle cx="12" cy="12" r="10" />
//                             <line x1="12" y1="8" x2="12" y2="16" />
//                             <line x1="8" y1="12" x2="16" y2="12" />
//                           </svg>
//                           Tambah Lagu
//                         </button>
//                         <input
//                           id="music-upload"
//                           type="file"
//                           accept="audio/*"
//                           onChange={handleUpload}
//                           className="hidden"
//                         />
//                       </div>
//                     )}
//                   </li>
//                 ))}
//               </ul>

//               {/* Kontrol Player */}
//               <div className="mt-4 border-t pt-4 flex flex-col gap-3">
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={isPlaying ? handlePause : handlePlay}
//                     className="w-8 h-8 rounded-full flex items-center justify-center"
//                   >
//                     <img
//                       src={isPlaying ? pauseIcon : playIcon}
//                       alt="PlayPause"
//                       className="w-4 h-4"
//                     />
//                   </button>
//                   <span className="text-gray-700 text-sm truncate">
//                     {current ? cleanFileName(current.name) : "Belum ada lagu"}
//                   </span>
//                 </div>

//                 <div className="relative w-full h-3 rounded-full bg-gray-800 shadow-inner overflow-hidden">
//                   <div
//                     className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-300"
//                     style={{
//                       width: `${progress}%`,
//                       boxShadow: `0 0 8px rgba(219,39,119,0.6)`,
//                     }}
//                   ></div>

//                   <input
//                     type="range"
//                     min="0"
//                     max="100"
//                     value={progress}
//                     onChange={(e) => {
//                       const seek =
//                         (audioRef.current.duration * e.target.value) / 100;
//                       audioRef.current.currentTime = seek;
//                       setProgress(Number(e.target.value));
//                     }}
//                     className="absolute inset-0 w-full h-full appearance-none cursor-pointer opacity-0"
//                   />

//                   <div
//                     className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 hover:scale-125"
//                     style={{ left: `calc(${progress}% - 10px)` }}
//                   />
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {current && <audio ref={audioRef} src={current.src} />}
//     </>
//   );
// };

// export default MusicPlayer;
