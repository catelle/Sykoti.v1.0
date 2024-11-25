
"use client"

import { fetchCurrentUserData } from "@/app/action/firebaseClient";
import { auth, db } from "@/lib/firebaseSetup";
import { arrayUnion, collection, doc, getDoc, query, updateDoc, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { ToolsDropdown } from "./Tools";
import Notification from "./Notification";
import UnreadNewsNotification, { unreadNewsNumber } from "./UnreadNotification";
import { fetchNewsItems } from "@/app/action/fetchData";
import TableSearch from "./TableSearch";
import ThemeToggle from "./ThemeToggle";

interface UserData {
  uid: string;
  role: string;
  pseudo:string;
  photo:string;
  // Add other fields as necessary
}

type NewsItem = {
  id: string;
  image: any;
  title: any;
  description: any;
  link: any;
  date: any;
  pays: any;
  readByUsers: any;

};

const Navbar = () => {

  const router= useRouter();
  const [pseudo, setPseudo] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState("");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [user, loading, error]= useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null); 
    
  let token: string | null = null;
    
  if (typeof window !== "undefined") {
    token = localStorage.getItem("ACCESS_TOKEN");
  }
    
    useEffect(() => {
      if (!token) {
        //router.push("/login");
      }
    }, [token, router]);
  
    useEffect(() => {
      const getUserData = async () => {
          if (loading) return; // Wait for loading to finish
          if (error) {
              console.error("Error in auth state:", error);
             // router.push("/login");
              return;
          }
          if (user) {
              // Ensure user is defined before accessing uid
              const data = await fetchCurrentUserData(user.uid); // Pass the user.uid directly
              if (data) {
                setUserData(data);
                setPseudo(data.pseudo);
                setRole(data.role);
                setPhoto(data.photo);
                console.log(user.uid);
                
              } else {
                  console.log("User not found in both collections");
                //  router.push("/login");
              }
          } else {
              console.log("No user is logged in");
           //   router.push("/login");
          }
      };
  
      getUserData();
  }, [user, loading, error, router]); // Add dependencies here
  
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


  const markAsRead = async (newsId: string, userId: string) => {
    if(userId !=""){
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
    }}
  };

  return (
    <div className="sticky top-0 flex bg-white dark:bg-gray-800 items-center justify-between p-4 z-[1000]">
  {/* SEARCH BAR */}
  <div className="hidden md:flex items-center gap-2 text-xs px-2 dark:text-gray-200">
    <TableSearch />
  </div>

  {/* ICONS AND USER */}
  <div className="flex items-center gap-6 justify-end w-full">
  <div className=" text-red-500 text-xl ml-6 leading-3 font-medium dark:text-red-500"
  >
     <button
     onClick={()=>{router.push("/list/forms/alert")}}>SOS</button> 
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
      <ToolsDropdown />
    </div>
   
    <div className="bg-white dark:bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
      <Notification userId={user?.uid || ''} />
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
      <UnreadNewsNotification
        newsItems={items}
        userId={user?.uid || ''}
        markAsRead={markAsRead}
      />
      <div className="absolute bg-red-500 -top-3 -right-3 w-5 h-5 flex items-center justify-center text-white rounded-full text-xs">
        {unreadNewsNumber}
      </div>
    </div>
    <ThemeToggle />
    {photo && (
      <div>
      <img
        src={photo}
        alt="User Profile"
        width={36}
        height={36}
        className="rounded-full"
      />
      <span className="text-xs leading-3 font-medium dark:text-gray-200">{pseudo}</span>
      </div>
    )}
    {!photo && (
       <div>
      <Image
        src="/avatar.png"
        alt=""
        width={36}
        height={36}
        className="rounded-full"
      />
      <span className="text-xs leading-3 font-medium dark:text-gray-200">{pseudo}</span>
      </div>
    )}
  </div>
</div>

  );  
}

export default Navbar