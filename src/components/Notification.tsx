
import React, { useEffect, useRef, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebaseSetup';
import Link from 'next/link';
import { Button } from './ui/button';


interface NotificationProps {
  userId: string; // The userId is of type string
}

interface Message {
  id: string;
  message: string;
  timestamp: any; // Timestamp type from Firebase Firestore
  read: boolean;
  archive: boolean;
}

  const Notification: React.FC<NotificationProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesRef = collection(db, 'MessageCollection');
        const q = query(
          messagesRef,
          where('userid', '==', userId),
          where('archive', '==', false),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const fetchedMessages = querySnapshot.docs.map((doc) => {
            const { id } = doc; // Extract id separately
            const data = doc.data() as Message; // Get the rest of the message data
          
            // Remove 'id' from data if it's part of the Message data
            const { id: _, ...restOfData } = data;
          
            return {
              id, // Use doc.id for the id
              ...restOfData, // Spread the remaining fields
            };
          });
          

        setMessages(fetchedMessages);
        setUnreadCount(fetchedMessages.filter((message) => !message.read).length);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        setError(error.message);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleDelete = async (id: string) => {
    try {
      const messageDocRef = doc(db, 'MessageCollection', id);
      await deleteDoc(messageDocRef);
      setMessages(messages.filter((message) => message.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const messageDocRef = doc(db, 'MessageCollection', id);
      await updateDoc(messageDocRef, { archive: true });
      setMessages(messages.map((message) => message.id === id ? { ...message, archive: true } : message));
    } catch (error) {
      console.error('Error archiving message:', error);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);

    if (!isDropdownOpen) {
      const markAllAsRead = async () => {
        try {
          const messagesRef = collection(db, 'MessageCollection');
          const q = query(messagesRef, where('userid', '==', userId), where('read', '==', false));
          const querySnapshot = await getDocs(q);

          const batchPromises = querySnapshot.docs.map((docSnapshot) => {
            const messageDocRef = doc(db, 'MessageCollection', docSnapshot.id);
            return updateDoc(messageDocRef, { read: true });
          });

          await Promise.all(batchPromises);
          setMessages(messages.map((message) => ({ ...message, read: true })));
          setUnreadCount(0);
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      };
      markAllAsRead();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
  <button
    type="button"
    className="relative text-white px-4 py-2 rounded focus:outline-none"
    onClick={handleDropdownToggle}
  >
    <span className="text-pink-500 dark:text-pink-300">🔔</span>
    {unreadCount > 0 && (
      <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white dark:bg-red-600 dark:text-gray-200 rounded-full px-2 py-1 text-xs">
        {unreadCount}
      </span>
    )}
  </button>

  {isDropdownOpen && (
    <div className="absolute left-0 mr-2 sm:right-4 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
      {error ? (
        <div className="p-4 text-red-500 dark:text-red-400">
          Error loading notifications: {error}
        </div>
      ) : messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message.id}
            className="flex items-center justify-between p-4 border-b dark:border-gray-700"
          >
            <Link
              href={`/list/messages/${message.id}`}
              className={`text-blue-600 dark:text-blue-500 ${
                message.read ? 'opacity-50' : ''
              }`}
              onClick={handleDropdownToggle}
            >
              <div>
                <div className="text-gray-900 dark:text-white">
                  {new Date(message.timestamp.toDate()).toLocaleString()}
                </div>
                <div className="text-gray-900 dark:text-white">
                  {typeof message.message === 'string'
                    ? message.message.slice(0, 30)
                    : 'No content'}
                  ...
                </div>
              </div>
            </Link>
            <div className="flex space-x-2">
              <Button
                className="bg-red-500 dark:bg-red-600 text-white px-2 py-1 text-xs rounded"
                onClick={() => handleDelete(message.id)}
              >
                Delete
              </Button>
              <Button
                className="bg-gray-500 dark:bg-gray-700 text-white px-2 py-1 text-xs rounded"
                onClick={() => handleArchive(message.id)}
              >
                Archive
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-gray-700 dark:text-gray-300">No messages</div>
      )}
    </div>
  )}
</div>

  

  );
};

export default Notification;
