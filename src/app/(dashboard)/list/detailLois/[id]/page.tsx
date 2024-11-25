"use client";

import { useEffect, useState } from "react";
import { fetchLoisItems } from "@/app/action/fetchData"; // Adjust path if needed
import { useParams, useRouter } from "next/navigation";



type LoiItem = {
    id: string;
    title: string;
    country: string;
    image: string;
    link:string;
    content:string;
  };

const DetailLoiView = () => {
  const router = useRouter();
  const { id } = useParams();// Get the 'id' from the URL
  const [item, setItem] = useState<LoiItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const loisItems = await fetchLoisItems(); // Fetch all items
          const foundItem = loisItems.find((loi) => loi.id === id); // Find the item by ID
          setItem(foundItem || null); // Set the item if found
        } catch (error) {
          console.error("Error fetching item:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchItem();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!item) {
    return <p>Item not found.</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 mt-4 ml-6 mr-6 rounded-md shadow-lg flex flex-col items-center">
    <h2 className="text-2xl font-semibold text-center mb-2 text-gray-800 dark:text-white">{item.title}</h2>
    <p className="text-center mb-2 text-gray-700 dark:text-gray-300"><strong>Pays:</strong> {item.country}</p>
    <p className="text-center">
      <a 
        href={item.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mb-2 text-blue-500 underline dark:text-blue-300"
      >
        Document complet
      </a>
    </p>
    <img 
      src={item.image} 
      alt={item.title} 
      className="text-2xl mt-4 mb-2 max-w-full"
    />
    <p className="p-6 text-gray-900 dark:text-gray-200"> {item.content}</p>
    {/* Add other details as needed */}
  </div>
  
  
  );
};

export default DetailLoiView;