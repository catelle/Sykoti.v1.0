"use client";
import { fetchNewsItems, fetchScamsItems } from "@/app/action/fetchData";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { useEffect, useState } from "react";
import { role } from "@/lib/data";
import DetailModal from "../DetailsComponent/page";
import { useRouter } from "next/navigation";
import DetailNewsModal from "../detailsNews/pages";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebaseSetup";
import { arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";

type NewsItem = {
    id: string;
    image: any;
    title: any;
    description: any;
    link: any;
    date: any;
    pays:any;
    readByUsers: any[];

};




// Component to render each scam item
const NewsView = ({ newsItem, onClick }: { newsItem: NewsItem; onClick: (item: NewsItem) => void }) => {
    return (
      <div
      className={`border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-lamaPurpleLight dark:hover:bg-gray-700 flex items-center`}
      onClick={() => onClick(newsItem)} // Handle click to open modal
    >
      <div className="relative">
        <Image
          src={newsItem.image || '/search.png'} // Fallback to a default image
          alt=""
          width={100}
          height={100}
          className="transition-all duration-300 ease-in-out"
        />
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {newsItem.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {newsItem.pays} {newsItem.date}
        </p>
      </div>
    </div>
    
    );
  };
  

const NewsPage = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [user, loading, error]= useAuthState(auth);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const router = useRouter();


  useEffect(() => {
    const loadScamItems = async () => {
      try {
        const newsItems = await fetchNewsItems();
        console.log(newsItems);
        setItems(newsItems);
      } catch (error) {
        console.error("Error fetching scam items:", error);
      }
    };
    loadScamItems();
  }, []);


  const closeModal = () => {
    setSelectedItem(null); // Close the modal by setting selectedItem to null
  };

  const userId= user?.uid||"";
  const handleItemClick = async (item: NewsItem) => {
    // Update the read status in Firestore
    await markAsRead(item.id, userId);

    // Open the selected item in a modal
    setSelectedItem(item);
  };

  const markAsRead = async (newsId: string, userId: string) => {
    try {
      // Reference to the specific news item document in Firestore
      const newsRef = doc(db, "NewsCollection", newsId);
  
      // Fetch the document
      const newsDoc = await getDoc(newsRef);
  

      if (newsDoc.exists()) {
        const newsData = newsDoc.data();

        // Check if the userId is already in the readByUsers array
        if (newsData?.readByUsers && !newsData.readByUsers.includes(userId)) {
          // Update Firestore: add the userId to the readByUsers array
          await updateDoc(newsRef, {
            readByUsers: arrayUnion(userId), // Add userId to the votes array
              // Increment the likes count by 1
          });

          // Optimistically update the local state (UI) to reflect the change
          setItems((prevItems) =>
            prevItems.map((newsItem) =>
              newsItem.id === newsId
                ? {
                    ...newsItem,
                    readByUsers: [...newsItem.readByUsers, userId],
                  }
                : newsItem
            )
          );
        }
      }
    } catch (error) {
      console.error("Error marking news as read:", error);
    }
  };

  
 

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md flex-1 m-4 mt-4 relative">
    {/* TOP */}
    <div className="flex items-center justify-between">
      <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-white">
        Actualités récentes
      </h1>
    </div>
  
    {/* SCROLLABLE LIST */}
    <div className="assignment-list overflow-y-auto h-[600px] mt-4">
      {items.map((newsItem: NewsItem) => (
        <NewsView key={newsItem.id} newsItem={newsItem} onClick={handleItemClick} />
      ))}
    </div>
  
    {/* PAGINATION */}
    <Pagination />
  
    {/* MODAL */}
    {selectedItem && <DetailNewsModal item={selectedItem} onClose={closeModal} />}
  </div>
  






  );
};

export default NewsPage;
