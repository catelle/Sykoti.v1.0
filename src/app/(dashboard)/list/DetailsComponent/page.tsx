import { FC } from "react";

type DetailModalProps = {
  item: Record<string, any>;
  onClose: () => void;
};

const DetailModal: FC<DetailModalProps> = ({ item, onClose }) => {
  const renderItemDetails = () => {
    if ("status" in item) {
      // If it's a ScamItem
      return (
        <>
          <p><strong>Status:</strong> {item.status}</p>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Platform:</strong> {item.platform}</p>
          <p><strong>Date:</strong> {item.date}</p>
          <p><strong>Content:</strong> {item.content}</p>
         {item.link&& <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            More Details
          </a>}
        </>
      );
    } else if ("country" in item && "link" in item) {
      // If it's a LoiItem
      return (
        <>
          <p><strong>Country:</strong> {item.country}</p>
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Full Law Document
          </a>
        </>
      );
    } else if ("storyCat" in item) {
      // If it's a temItem
      return (
        <>
          <p><strong>Platform:</strong> {item.platform}</p>
          <p><strong>Story Category:</strong> {item.storyCat}</p>
          <p><strong>Likes:</strong> {item.likesCount}</p>
          <p><strong>Votes:</strong> {item.votesCount}</p>
        </>
      );
    } else {
      // If no specific type, render all properties
      return (
        <>
          {Object.entries(item).map(([key, value]) => (
            <p key={key} className="text-gray-700 dark:text-white">
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value.toString()}
            </p>
          ))}
        </>
      );
    }
  };

  return (
    <div  className="fixed inset-0 bg-black bg-opacity-50 mt-10 flex items-center justify-center">
    <div  style={{ borderRadius: '15px' }} className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-[300px] relative shadow-md">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
      >
        &times;
      </button>
  
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {item.title || item.description}
      </h2>
  
      {/* Image */}
      {item.image && (
        <img
          src={item.image}
          alt={item.title || item.description}
          className="w-[200px] h-[200px] mb-4 mx-auto block rounded-md border border-gray-300 dark:border-gray-600"
        />
      )}
  
      {/* Details Section */}
      <div className="space-y-2 text-gray-800 dark:text-gray-300">
        {renderItemDetails()}
      </div>
    </div>
  </div>
  

  );
};

export default DetailModal;
