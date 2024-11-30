import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";


type NewsItem = {
  id: string;
  image: any;
  title: any;
  description: any;
  link: any;
  date: any;
  pays: any;
  readByUsers: any[];
};

interface UnreadNewsNotificationProps {
  newsItems: NewsItem[]; // The full list of news
  userId: string; // User ID to track individual read/unread status
  markAsRead: (userId: string, newsId: string) => void; // Function to mark news as read
  onUnreadNewsCountChange: (count: number) => void;
}

const UnreadNewsNotification: React.FC<UnreadNewsNotificationProps> = ({
  newsItems,
  userId,
  markAsRead,
  onUnreadNewsCountChange,
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle the notification box
  const [unreadNewsNumber, setUnreadNewsNumber] = useState(0); // State for unread news count
  const unreadNews = newsItems.filter((news) => !news.readByUsers?.includes(userId));

  useEffect(() => {
    setUnreadNewsNumber(unreadNews.length); // Update unread news count when newsItems change
  }, [newsItems, userId]); // Recalculate unread count when newsItems or userId changes


  useEffect(() => {
    const count = unreadNews.length;
    setUnreadNewsNumber(count); // Update the local state
    onUnreadNewsCountChange(count); // Notify the parent component
  }, [newsItems, userId, onUnreadNewsCountChange]); // Trigger whenever dependencies change

  const notificationRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter(); // Initialize Next.js router

  // Handle click outside to close the notification box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close the dropdown
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen); // Toggle the notification box visibility
  };

  const handleMarkAsRead = (newsId: string) => {
    markAsRead(userId, newsId); // Mark the clicked news as read for this user
    router.push("/list/news"); // Navigate to '/list/news'
  };

  return (
    <div ref={notificationRef}>
      {/* Button showing the number of unread news */}
      <button
        onClick={handleClick}
        className="rounded-md bg-white text-gray-700 h-[50px] w-[50px] hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <span className="h-[20px] w-[20px]">
          <Image
            src="/img/announcement.png"
            alt="Announcement Icon"
            width={24}  // Adjust size for smaller screens
            height={24}
          />
        </span>
      </button>

      {/* Notification box (visible when isOpen is true) */}
      {isOpen && (
        <div className="absolute mt-2 w-[90%] sm:w-[550px] md:w-[600px] lg:w-[550px] bg-white border rounded-md shadow-lg z-[1001] overflow-auto max-h-[400px]">
          <h3 className="font-semibold mb-2 px-4 py-2 border-b text-gray-900">Actualités</h3>
          <ul className="space-y-2 p-4">
            {unreadNews.map((news) => (
              <li
                key={news.id}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition duration-200"
                onClick={() => handleMarkAsRead(news.id)}
              >
                <div className="w-12 h-12 mr-3">
                  <Image
                    src={news.image}
                    alt={news.title}
                    width={48}
                    height={48}
                    className="object-cover rounded-full"
                  />
                </div>
                <p className="text-gray-800 text-sm font-medium truncate">{news.title}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show unread news count */}
      <div className="absolute bg-red-500 -top-3 -right-3 w-5 h-5 flex items-center justify-center text-white rounded-full text-xs">
        {unreadNewsNumber}
      </div>
    </div>
  );
};

export default UnreadNewsNotification;
