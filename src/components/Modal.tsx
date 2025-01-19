interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal_Menu = ({ title, onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded w-[400px]">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-red-500">
            Fechar
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal_Menu;
