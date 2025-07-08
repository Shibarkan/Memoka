const MusicTabs = ({ tab, setTab }) => {
  const isActive = (value) =>
    tab === value
      ? "bg-white text-pink-500 shadow font-semibold"
      : "text-gray-600 hover:text-pink-500";

  return (
    <div className="flex items-center justify-center bg-gray-200 rounded-full p-1 w-full max-w-xs mx-auto mb-4">
      <button
        onClick={() => setTab("default")}
        className={`w-1/2 py-2 text-sm rounded-full transition ${isActive("default")}`}
      >
        Default
      </button>
      <button
        onClick={() => setTab("user")}
        className={`w-1/2 py-2 text-sm rounded-full transition ${isActive("user")}`}
      >
        My Music
      </button>
    </div>
  );
};

export default MusicTabs;
