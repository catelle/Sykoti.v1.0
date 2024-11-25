import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";


export let unreadNewsNumber: number;

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
}

const UnreadNewsNotification: React.FC<UnreadNewsNotificationProps> = ({
  newsItems,
  userId,
  markAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle the notification box
  const unreadNews = newsItems.filter((news) => !news.readByUsers?.includes(userId));
  unreadNewsNumber = unreadNews.length; // Get the length of unreadNews

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
  className="flex items-center gap-2 text-xs rounded-full ring-gray-300 "
>
  <Image
    src="/announcement.png"
    alt="Announcement Icon"
    width={24}  // Adjust size for smaller screens
    height={24}
/>
</button>


      {/* Notification box (visible when isOpen is true) */}
      {isOpen && (
        <div
          className="absolute mt-2 w-[90%] sm:w-[550px] md:w-[600px] lg:w-[550px] bg-white border rounded-md shadow-lg z-[1001] overflow-auto max-h-[400px]"
        >
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
    </div>
  );
};

export default UnreadNewsNotification;
