// src/app/(dashboard)/list/DetailsComponent/page.tsx


import { FC } from "react";

type DetailScamModalProps = {
    item: Record<string, any>;
    onClose: () => void;
};

const DetailScamModal: FC<DetailScamModalProps> = ({ item, onClose }) => {
  const renderItemDetails = () => {
    return (
      <>
        {Object.entries(item).map(([key, value]) => (
          <p key={key} className="text-gray-700 dark:text-white">
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value.toString()}
          </p>
        ))}
      </>
    );
  };

 
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 mt-10 flex items-center justify-center">
        <div style={{ borderRadius: '15px' }} className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-[300px] relative shadow-md">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            &times;
          </button>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            { item.description}
          </h2>
          {item.image && (
            <img
              src={item.image}
              alt={item.description}
              className="w-[200px] h-[200px] mb-4 mx-auto block rounded-md border border-gray-300 dark:border-gray-600"
            />
          )}
          <div className="space-y-2 text-gray-800 dark:text-gray-300">
            {renderItemDetails()}
          </div>
        </div>
      </div>
    );
  };
  
export default DetailScamModal;
