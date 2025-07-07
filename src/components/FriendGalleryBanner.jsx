const FriendGalleryBanner = ({ currentCode, exitFriendGallery }) => (
<div className="fixed top-4 left-1/2 -translate-x-1/2 backdrop-blur-lg bg-white/60 shadow-2xl rounded-3xl px-8 py-4 z-50 border border-pink-200 ring-2 ring-pink-100 animate-slide-in-down">
  <p className="text-sm text-neutral-800 text-center">
    <span className="inline-block animate-pulse mr-1">📸{currentCode}</span>
  </p>
  <button
    onClick={exitFriendGallery}
    className="mt-3 flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white font-semibold px-5 py-2 rounded-2xl hover:scale-105 active:scale-95 transition transform duration-200 shadow-lg"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
    </svg>
    Keluar
  </button>
</div>


);

export default FriendGalleryBanner;
