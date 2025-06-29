import { Check, X } from "lucide-react";

const EditInput = ({ item, newDesc, setNewDesc, handleEdit, setEditId }) => {
  const handleSave = () => {
    handleEdit(item, newDesc);
    setEditId(null); // ✅ Keluar dari mode edit
  };

  return (
    <div className="mt-2">
      <input
        type="text"
        className="w-full border rounded p-1 text-sm mb-2"
        value={newDesc}
        onChange={(e) => setNewDesc(e.target.value)}
        placeholder="Keterangan baru..."
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={handleSave}
          className="bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600 flex items-center gap-1 text-sm"
        >
          <Check size={14} /> Simpan
        </button>
        <button
          onClick={() => setEditId(null)}
          className="bg-neutral-200 px-2 py-1 rounded hover:bg-neutral-300 flex items-center gap-1 text-sm"
        >
          <X size={14} /> Batal
        </button>
      </div>
    </div>
  );
};

export default EditInput;
