const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3">✕</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;