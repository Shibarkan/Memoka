import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveformVisualizer = ({ audioRef }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src || !waveformRef.current) return;

    // Destroy sebelumnya jika ada
    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }

    // Inisialisasi WaveSurfer
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "rgba(236, 72, 153, 0.3)",
      progressColor: "#ec4899",
      barWidth: 2,
      barGap: 1,
      height: 60,
      responsive: true,
      cursorColor: "#000",
      interact: false,
      cursorWidth: 1.5,
    });

    // Load audio
    wavesurfer.current.load(audio.src).catch((err) => {
      if (err.name !== "AbortError") {
        console.error("Waveform load error:", err);
      }
    });

    // Sinkronisasi progress
    const syncProgress = () => {
      if (
        wavesurfer.current &&
        typeof audio.currentTime === "number" &&
        typeof audio.duration === "number" &&
        audio.duration > 0
      ) {
        const progress = audio.currentTime / audio.duration;
        wavesurfer.current.seekTo(progress);
      }
    };

    audio.addEventListener("timeupdate", syncProgress);

    // Cleanup saat unmount
    return () => {
      audio.removeEventListener("timeupdate", syncProgress);
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [audioRef?.current?.src]);

  return (
    <div
      ref={waveformRef}
      className="mt-3 border border-pink-200 rounded-xl shadow-inner bg-white overflow-hidden"
      style={{ height: "60px", width: "100%" }}
    />
  );
};

export default WaveformVisualizer;
