import { useEffect, useState } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
    setFavorites(stored);
  }, []);

  const toggleFavorite = (songName) => {
    let updated = [];
    if (favorites.includes(songName)) {
      updated = favorites.filter((name) => name !== songName);
    } else {
      updated = [...favorites, songName];
    }
    setFavorites(updated);
    localStorage.setItem("favoriteSongs", JSON.stringify(updated));
  };

  const isFavorite = (songName) => favorites.includes(songName);

  return { favorites, toggleFavorite, isFavorite };
};
