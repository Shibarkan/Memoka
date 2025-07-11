import playIcon from "../../assets/play.WebP";
import pauseIcon from "../../assets/pause.WebP";

const MusicControls = ({
  current,
  isPlaying,
  onPlay,
  onPause,
  cleanFileName,
  progress,
  setProgress,
  audioRef,
}) => (
  <div className="mt-4 border-t pt-4 flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="w-8 h-8 rounded-full flex items-center justify-center"
      >
        <img
          src={isPlaying ? pauseIcon : playIcon}
          alt="PlayPause"
          className="w-4 h-4"
        />
      </button>
      <span className="text-gray-700 text-sm truncate">
        {current ? cleanFileName(current.name) : "Belum ada lagu"}
      </span>
    </div>
 
    <div className="relative w-full h-3 rounded-full bg-gray-800 shadow-inner overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
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
          const seek = (audioRef.current.duration * e.target.value) / 100;
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
);

export default MusicControls;
