import ReactDOM from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg shadow-xl z-50 w-full max-w-lg">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Modal Title</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
          >
            &times;
          </button>
        </div>
        <div className="p-6 text-white">
          {children}
        </div>
      </div>
    </>
    ,
    document.getElementById('modal-root')
  );
}
export default Modal;