const ConfirmDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 backdrop-blur-lg p-7 rounded-2xl shadow-2xl border border-white/10 
                    transform transition-all duration-300 scale-100 animate-fadeIn max-w-md w-full mx-4">
        <p className="mb-6 text-gray-200 font-medium text-lg">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white/5 text-gray-300 rounded-full hover:bg-white/10 
                     transition-all duration-300 transform hover:scale-102 active:scale-98"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 
                     transition-all duration-300 transform hover:scale-102 active:scale-98"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
