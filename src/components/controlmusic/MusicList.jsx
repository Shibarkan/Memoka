import { Trash2, Star } from "lucide-react";

const MusicList = ({
  musicList,
  current,
  onSelect,
  onConfirmDelete,
  tab,
  cleanFileName,
  toggleFavorite,
  isFavorite,
}) => (
  <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 text-sm">
    {musicList.map((song) => (
      <li
        key={song.name}
        className={`group flex items-center justify-between gap-2 px-2 py-1 rounded text-sm ${
          current?.name === song.name ? "bg-pink-100" : "hover:bg-pink-50"
        }`}
      >
        <span
          onClick={() => onSelect(song)}
          className="flex-1 truncate cursor-pointer"
        >
          {cleanFileName(song.name)}
        </span>

        {tab === "user" && (
          <div className="flex items-center gap-2">
            {/* Tombol favorit */}
            <button
              onClick={() => toggleFavorite(song.name)}
              className="text-yellow-400 hover:text-yellow-500 transition"
              aria-label="Toggle Favorite"
            >
              <Star
                className={`w-4 h-4 ${
                  isFavorite(song.name) ? "fill-current" : ""
                }`}
              />
            </button>

            {/* Tombol hapus */}
            <button
              onClick={() => onConfirmDelete(song)}
              className="text-gray-400 hover:text-red-500 transition"
              aria-label="Hapus lagu"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </li>
    ))}
  </ul>
);

export default MusicList;
