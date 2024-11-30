import { FC } from "react";

type DetailNewsModalProps = {
    item: Record<string, any>;
    onClose: () => void;
};

const DetailNewsModal: FC<DetailNewsModalProps> = ({ item, onClose }) => {
    const renderItemDetails = () => {
        return (
          <>
          <p className="text-gray-900 dark:text-white">
            <strong>Description:</strong> {item.description}
          </p>
          <p className="text-gray-900 dark:text-white">
            <strong>Pays:</strong> {item.pays}
          </p>
          <p className="text-gray-900 dark:text-white">
            <strong>Date:</strong> {item.date}
          </p>
    
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-300 underline"
            >
              Voir plus
            </a>
          )}
        </>
      );
  };

  return (
      <div
        style={{ borderRadius: '10px' }}
        className="fixed inset-0 top-14 rounded bg-black bg-opacity-50 flex items-center justify-center">
        <div 
          style={{ borderRadius: '10px' }}
          className="bg-white dark:bg-gray-800 p-6 mt-6 rounded-lg max-w-md w-[400px] relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            &times;
          </button>
          <h2 className="text-lg font-semibold mb-4 text-red-900 dark:text-white">
            {item.title || ""}
          </h2>
          {item.image && (
            <img
              src={item.image}
              alt=""
              className="w-[250px] h-[250px] mb-4 mx-auto block"
            />
          )}
          <div className="space-y-2">{renderItemDetails()}</div>
        </div>
      </div>
  );
};
export default DetailNewsModal;
