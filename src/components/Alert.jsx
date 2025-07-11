import { useState } from "react";
import { motion } from "framer-motion";
import alertImg from "../assets/alert.WebP";

export default function Alert() {
  const [showPopup, setShowPopup] = useState(false);
  const [hideIcon, setHideIcon] = useState(false);

  const handleClick = () => {
    setShowPopup(true);
  };
 
  const handleClose = () => {
    setShowPopup(false);
    setHideIcon(true); // sembunyikan ikon setelah popup ditutup
  };

  return (
    <>
      {/* Alert Icon */}
      {!hideIcon && (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="fixed top-4 right-4 z-50"
        >
          <img
            src={alertImg}
            alt="alert"
            onClick={handleClick}
            className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-300"
          />
        </motion.div>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4 text-center"
          >
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              Memoka - LoveGallery
            </h2>
            <ul className="text-gray-600 text-left list-disc pl-6">
              <p>
                Adalah website dimana kamu bisa upload file dalam format
                png/jpg/jpeg/gif, lalu ditampilkan di layar sehingga mirip
                phothobooth yang estetik
              </p>
              <br />
              <li>Upload ✅</li>
              <li>Edit✅</li>
              <li>Review Gallery Teman ✅</li>
              <li>Putar Music ✅</li>
              <br />
              <strong>
                <p>Ayo kunjungi gallery teman teman anda!!</p>
              </strong>

              <br />
            </ul>
            <button
              onClick={handleClose}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Tutup
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
