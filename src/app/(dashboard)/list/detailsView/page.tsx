"use client";

import { FC, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import fetchHistoryItems, { fetchTemoignageItemById, incrementLike } from "@/app/action/fetchData";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseSetup";

const DetailView: FC = ({ }) => {
  const [item, setItem] = useState<HistoryItem | null>(null);;
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const itemId = searchParams.get("id");
  const [currentIndexh, setCurrentIndexh] = useState(0);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const router = useRouter(); // Initialize useRouter
  const [showCarousel, setShowCarousel] = useState(false); // New state for visibility
  const [user, error] = useAuthState(auth);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const hasLiked = Array.isArray(item?.likes) && user?.uid ? item.likes.includes(user.uid) : false;


  type HistoryItem = {
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

  type temItem = {
    id: string;
    title: string;
    country: string;
    image: string;
    platform: string;
    storyCat: string;
    likesCount: number;
    votesCount: number;
  };

  useEffect(() => {
    const fetchItemData = async () => {
      setLoading(true);
      try {
        if (itemId) {
          const data = await fetchTemoignageItemById(itemId);
          setItem(data);
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItemData();
  }, [itemId]);

  useEffect(() => {
    const loadHistoryItems = async () => {
      const historyItems = await fetchHistoryItems();
      setItems(historyItems);
    };
    loadHistoryItems();
  }, []);

  // // Check for screen width to hide carousel on small screens
  // useEffect(() => {
  //   const handleResize = () => {
  //     setShowCarousel(window.innerWidth >= 640);
  //   };
  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const itemsPerView = window.innerWidth < 640 ? 2 : 3;

  const handlePrev = () => {
    setCurrentIndexh((prevIndex) => Math.max(prevIndex - itemsPerView, 0));
  };

  const handleNext = () => {
    setCurrentIndexh((prevIndex) =>
      Math.min(prevIndex + itemsPerView, items.length - itemsPerView)
    );
  };

  const handleLike = async (itemsend: HistoryItem, userId: string) => {

    console.log("Attempting to like the item...");
    const itemId = itemsend.id;
    try {
      // Check if the user has already voted
      if (itemsend.likes && Array.isArray(itemsend.likes) && itemsend.likes.includes(user?.uid)) {
        console.log("User has already liked this item.");
      } else {


        // Increment the like count in the database
        await incrementLike(itemId, userId);

        // Update the state to reflect the new like
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? {
                ...item,
                likesCount: item.likecount + 1, // Increment likes count
                likes: Array.isArray(item.likes) // Ensure likes is an array
                  ? [...item.likes, userId]
                  : [userId], // Initialize as an array with userId if not already an array
              }
              : item
          )
        );

        console.log("Item successfully liked!");
        router.push(`/list/detailsView?id=${itemId}`)
      }
    } catch (error) {
      console.error("Error liking the item:", error);

      // Optionally, you could display a user-friendly error message here.
      alert("Failed to like the item. Please try again later.");
    }
  };



  const handleToggleCarousel = () => {
    setShowCarousel((prev) => !prev);
  };
  const handleItemClick = (id: string) => {
    if (id) {
      router.push(`/list/detailsView?id=${id}`);
    } else {
      console.error("Item ID is undefined");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const renderItemDetails = (item: HistoryItem | null) => {
    if (!item) return null;

    // Assume item is a testimony item
    return (
      <>
        <p className="text-gray-900 dark:text-white">
          <strong>Platform:</strong> {item.platform} <strong>Categorie:</strong> {item.storyCat}
        </p>
        <p className="text-gray-900 dark:text-white">
          <strong className="mr-6">
            <button
              className={`${hasLiked ? "text-blue-500" : "text-gray-400"
                } dark:text-blue-400 dark:text-gray-500`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when liking
                if (user?.uid && item?.id) {
                  handleLike(item, user.uid); // Pass the required parameters
                } else {
                  console.error("User not logged in or item ID missing.");
                }
              }}
            >
              👍 {item.likecount} Likes
            </button>
          </strong>
          <strong className="text-gray-900 dark:text-white">👀 {item.votecount} Views</strong>
        </p>
      </>
    );
  };


  return (
    <div className="flex items-center justify-center mt-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-3xl mx-auto">
        {/* Button to toggle carousel visibility */}
        <span
          onClick={handleToggleCarousel}
          className="cursor-pointer text-red-600 dark:text-red-400 text-xl font-bold"
        >
          {showCarousel ? "▼" : "▲"} {/* Down and up arrow symbols */}
        </span>

        {/* Carousel Section */}
        {showCarousel && (
          <div className="relative p-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">History Carousel</h2> {/* Reduced top margin here */}
            <div className=" flex justify-between">
              <Button
                onClick={handlePrev}
                className="bg-gray-500 w-8 h-8 dark:bg-gray-600 text-white dark:text-gray-300 rounded-full"
              >
                ←
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gray-500 w-8 h-8 dark:bg-gray-600 text-white dark:text-gray-300 rounded-full"
              >
                →
              </Button>
            </div>

            <Carousel className="flex items-center relative">
              <div
                ref={carouselRef}
                className="flex overflow-x-scroll gap-4 w-full scrollbar-hide"
                onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
                onTouchMove={(e) => {
                  if (!touchStartX.current) return;
                  const difference = e.touches[0].clientX - touchStartX.current;
                  if (difference > 50) handlePrev();
                  else if (difference < -50) handleNext();
                  touchStartX.current = null;
                }}
              >
                {items.slice(currentIndexh, currentIndexh + itemsPerView).map((item) => (
                  <div
                    key={item.id}
                    className={`flex-shrink-0 h-30 ${itemsPerView === 2 ? "w-1/2" : "w-1/3"}`}
                    onClick={(event) => handleItemClick(item?.id)} // Pass both event and item
                  >
                    <div
                      className="relative h-28 bg-cover bg-center rounded-md"
                      style={{ backgroundImage: `url(${item.image})` }}
                    >
                      {/* Black transparent overlay */}
                      <div className="absolute inset-0 bg-black opacity-40 rounded-md" />
                      {/* Title centered on top of the image */}
                      <p className="absolute inset-0 text-center text-white font-semibold flex items-center justify-center">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Carousel>
          </div>
        )}

        {/* Centered Title and Image */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{item?.title || ""}</h2>
          {item?.image && (
            <img
              src={item.image}
              alt={item.title || ""}
              className="mb-4 w-full h-full max-w-sm max-h-96 object-contain rounded-lg mx-auto"
            />
          )}
          <div className="space-y-2">{renderItemDetails(item)}</div>
        </div>

        {/* Left-Aligned Sections */}
        <div className="space-y-4 p-8">
          <p className="text-center text-xl text-gray-900 dark:text-white">{item?.introduction}</p>
          <p className="text-left text-xl text-gray-900 dark:text-white"> {item?.developpement}</p>
          <p className="text-center text-xl text-gray-900 dark:text-white">{item?.conclusion}</p>
        </div>
      </div>
    </div>

  );
};

export default DetailView;
