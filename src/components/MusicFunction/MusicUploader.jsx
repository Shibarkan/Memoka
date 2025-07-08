import { UploadCloud } from "lucide-react";

const MusicUploader = ({ onUpload }) => (
  <div className="mb-3">
    <button
      onClick={() => document.getElementById("music-upload").click()}
      className="group flex items-center justify-center gap-2 border-2 border-dashed border-pink-400 hover:border-pink-500 text-pink-500 hover:text-white bg-white hover:bg-pink-500 px-4 py-2 rounded-xl text-sm font-medium shadow transition-all duration-200"
    >
      <UploadCloud className="w-5 h-5 group-hover:animate-bounce" />
      <span>Tambah Lagu</span>
    </button>
    <input
      id="music-upload"
      type="file"
      accept="audio/*"
      onChange={onUpload}
      className="hidden"
    />
  </div>
);

export default MusicUploader;
