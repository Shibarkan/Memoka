const FriendGalleryBanner = ({ currentCode, exitFriendGallery }) => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-xl px-4 py-2 z-50 border border-pink-200">
    <p className="text-sm text-neutral-700">
      🔍 Kamu sedang melihat gallery teman <b className="text-pink-500">{currentCode}</b>
    </p>
    <button
      onClick={exitFriendGallery}
      className="mt-1 bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition"
    >
      🚪 Keluar
    </button>
  </div>
);

export default FriendGalleryBanner;
