"use client";

import fetchHistoryItems, {  incrementLike, incrementVote } from "@/app/action/fetchData"; // Assuming you have this function
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resultsData, role } from "@/lib/data";
import CategoryList from "@/components/categoryList";
import { Button } from "@/components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseSetup";

type temItem = {
  id: string;
  image: any;
  title: any;
  autor: any;
  date: any;
  conclusion: any;
  country: any;
  platform: any;
  storyCat: any;
  email: any;
  developpement: any;
  introduction: any;
  likecount: any;
  votecount: any;
  likes: any;
  votes: any;

};

// Component to render each testimony item
const TemView = ({
  temoignage,
  userId,
  onClick,

}: {
  temoignage: temItem;
  userId: string | undefined;
  onClick: (item: temItem) => void;
 
}) => {
  const hasLiked = userId && Array.isArray(temoignage.votes) ? temoignage.votes.includes(userId) : false;
 

  return (
<div
className="assignment-item flex items-center border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-lamaPurpleLight dark:hover:bg-gray-700"
onClick={() => onClick(temoignage)}
>
<Image
  src={temoignage.image}
  alt={temoignage.title}
  width={50}
  height={50}
  className="mr-4"
/>
<div className="flex-1">
  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
    {temoignage.title}
  </h3>
  <p className="text-gray-500 dark:text-gray-400">{temoignage.storyCat}</p>
  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-2">
    <span className="mr-4">
      <button
        className={`flex items-center space-x-1 ${
          hasLiked ? "text-blue-500" : "text-gray-400 dark:text-gray-500"
        }`}
        onClick={(e) => onClick(temoignage)}
      >
        👍 {temoignage.likecount} Likes
      </button>
    </span>
    <span>👀 {temoignage.votecount} Vues</span>
  </div>
</div>
</div>

  );
};

const TemoignageListPage = () => {
  const [items, setItems] = useState<temItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [user, loading, error]= useAuthState(auth);
  const [userId, setUserId] = useState<string | undefined>("mockUserId"); // Replace with actual user ID logic
  const router = useRouter();
  const categories = [
    "Escroquerie",
    "Catfish",
    "Cyberviolence",
    "Cyberintimidation",
    "Cyberdiscipline",
    "Cyberharcelement",
    "IngenierieS",
  ];

  useEffect(() => {
    const loadHistoryItems = async () => {
      try {
        const temItems = await fetchHistoryItems();
        setItems(temItems);
      } catch (error) {
        console.error("Error fetching temoignage items:", error);
      }
    };

    loadHistoryItems();
  }, []);
  

  const handleFilterChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleItemClick = async (itemsend: temItem) => {
    const itemId = itemsend.id;
  
    try {
      // Check if the user has already voted
      if (Array.isArray(itemsend.votes) && itemsend.votes.includes(user?.uid || "")) {
        console.log("User has already voted on this item.");
      } else {
        // Increment the vote count in the database only if the user hasn't voted
        await incrementVote(itemId, user?.uid || "");
  
        // Update the state to reflect the new vote
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  votesCount: item.votecount + 1, // Increment votes count
                  votes: Array.isArray(item.votes) // Ensure votes is an array
                    ? [...item.votes, user?.uid || ""] // Add the user's ID to the votes array
                    : [user?.uid || ""], // Initialize as an array with the user's ID if not already an array
                }
              : item
          )
        );
  
        console.log("Vote incremented successfully!");
      }
    } catch (error) {
      console.error("Error incrementing the vote:", error);
  
      // Optionally, you could display a user-friendly error message here
      alert("Failed to vote for the item. Please try again later.");
    }
  
    if (itemId) {
      router.push(`/list/detailsView?id=${itemId}`);
    } else {
      console.error("Item ID is undefined");
    }
  };
  

  

  const handleClick = () => {
    router.push("/list/forms/testimony");
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.storyCat === selectedCategory)
    : items;

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-4 relative h-screen ml-4  dark:bg-gray-800">
    {/* TOP HEADER (Fixed) */}
    <div className="sticky top-0 bg-white z-10 p-4 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold text-gray-800 dark:text-white">
          Témoignages réels
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <TableSearch /> */}
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleFilterChange(null)}
                className={`px-3 py-1 rounded-full border ${
                  !selectedCategory
                    ? "bg-lamaYellow text-gray-700 font-bold"
                    : "bg-white text-gray-700 dark:bg-gray-700 dark:text-white"
                }`}
              >
                All
              </Button>
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory || ""}
                handleFilterChange={handleFilterChange}
              />
            </div>
            {(role === "admin" || role === "user") && (
              <div
                onClick={handleClick}
                className="cursor-pointer bg-lamaYellow w-8 h-8 flex items-center justify-center rounded-full"
              >
                <Image src={"/create.png"} alt="Create Icon" width={16} height={16} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  
    {/* SCROLLABLE LIST */}
    <div className="overflow-y-auto h-[60vh] mt-4 dark:bg-gray-900">
      {filteredItems.map((temoignage: temItem) => (
        <TemView
          key={temoignage.id}
          temoignage={temoignage}
          userId={userId}
          onClick={handleItemClick}
        />
      ))}
    </div>
  
    {/* PAGINATION (Fixed) */}
    <div className="sticky bottom-0 bg-white p-4 z-10 dark:bg-gray-800">
      <Pagination />
    </div>
  </div>
  
  );
};

export default TemoignageListPage;
