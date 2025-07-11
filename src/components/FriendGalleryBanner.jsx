import { Eye } from "lucide-react";
import { LogOut } from "lucide-react";
const FriendGalleryBanner = ({ currentCode, exitFriendGallery }) => (
<div className="fixed top-4 left-1/2 -translate-x-1/2 backdrop-blur-lg bg-white/60 shadow-2xl rounded-2xl px-6 py-3 z-50 border border-pink-200 ring-2 ring-pink-100 animate-slide-in-down">
  <p className="text-sm text-neutral-800 text-center bg-red-200">
    <span className="flex animate-pulse mr-4 gap-4"><Eye size={20}/>{currentCode}
    </span>
  </p>
  <button
    onClick={exitFriendGallery}
    className="mt-2 flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold px-3 py-2 rounded-xl hover:scale-105 active:scale-95 transition transform duration-200 shadow-lg"
  >
    <LogOut size={25}/>
    Keluar
  </button>
</div>


);

export default FriendGalleryBanner;
