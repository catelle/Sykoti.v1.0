"use client"
import fetchHistoryItems from "@/app/action/fetchData";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { auth, db } from "@/lib/firebaseSetup";
import { arrayUnion, collection, doc, increment, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

const StudentPage = () => {
  const [role, setRole] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndexh, setCurrentIndexh] = useState(0);
  const [items, setItems] = useState<temItem[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true); // New state for autoplay control
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  useEffect(() => {
    // This will ensure code only runs in the browser, not on the server
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 640); // Check if the screen is small
      };

      // Add event listener for window resize
      window.addEventListener("resize", handleResize);

      // Run the check on component mount
      handleResize();

      // Cleanup the event listener on unmount
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); 


  const images = [
    {
      url: "/img/logo.png",
      text: "Aide",
      title: "Vous avez un problème en ligne ?",
      description: "Nous sommes là pour vous, cliquez ce bouton !",
      link: "/list/forms/alert",
    },
    {
      url: "/img/logo.png",
      text: "Témoigner",
      title: "Victime de cybercrime ?",
      description: "Partagez votre expérience, prévenons la repétition.",
      link: "/list/forms/testimony",
    },
    {
      url: "/img/avatar.png",
      text: "Partager",
      title: "Un scam ou une arnaque se répend en ligne ?",
      description: "Partagez-le pour informer les autres",
      link: "/list/forms/scam",
    },
    {
      url: "/img/logo.png",
      text: "Voir pllus",
      title: "Devenez un Cyberambassadeur",
      description: "Formez vous à la sécurité en ligne, soyez un atout précieux.",
      link: "/cybera",
    },
  ];

  interface temItem {
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
  }

  // Autoplay Effect with control
  useEffect(() => {
    if (isAutoplayActive) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000); // Change slides every 4 seconds

      return () => clearInterval(interval); // Clear interval on component unmount or autoplay stop
    }
  }, [isAutoplayActive]);

  // Fetch history items on component mount
  useEffect(() => {
    const loadHistoryItems = async () => {
      const historyItems = await fetchHistoryItems();
      setItems(historyItems); // Set the fetched items to state
    };
    loadHistoryItems(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once on mount

   const itemsPerView = isSmallScreen ? 2 : 3; // Show 1 item on small screens, 3 on larger screens

  const handlePrev = () => {
    setCurrentIndexh((prevIndex) => Math.max(prevIndex - itemsPerView, 0));
  };

  const handleNext = () => {
    setCurrentIndexh((prevIndex) =>
      Math.min(prevIndex + itemsPerView, items.length - itemsPerView)
    );
  };

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;

    const currentTouchX = e.touches[0].clientX;
    const difference = currentTouchX - touchStartX.current;

    // Determine swipe direction and trigger navigation
    if (difference > 50) {
      handlePrev();
      touchStartX.current = null; // reset to avoid repeated triggering
    } else if (difference < -50) {
      handleNext();
      touchStartX.current = null; // reset to avoid repeated triggering
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const uid = user?.uid; // Get the authenticated user's UID

  const userQuery = uid
    ? query(collection(db, 'usersCollection'), where('__name__', '==', uid))
    : null; // Set to null if uid is not available

  const [userD] = useCollection(userQuery);

  useEffect(() => {
    if (userD && !userD.empty) {
      const userData = userD.docs[0]?.data();
      if (userData.client === "") {
        router.push("/teacher");
      } else {
        setIsAdmin(true);
      }
    }
  }, [user]); // Runs only when 'user' changes

  const incrementViews = async (itemId: string, userId: string | "") => {
    try {
      const itemRef = doc(db, "historyCollection", itemId);
      await updateDoc(itemRef, {
        votes: arrayUnion(userId),
        voteCount: increment(1),
      });
   //   console.log("View count incremented successfully");
    } catch (error) {
    //  console.error("Failed to increment views", error);
    }
  };

  const handleItemClick = async (event: React.MouseEvent, item: temItem) => {
    const userId = user?.uid;

    if (!userId) {
      //console.error("User must be logged in to perform this action.");
      return;
    }

    if (!item.votes) {
      item.votes = [];
    }
    
    if (!item.votes.includes(userId)) {
      item.votes.push(userId);
      await incrementViews(item.id, userId);
     // console.log(`${userId} viewed item ${item.id}`);
    }
    

    router.push(`/list/detailsView?id=${item.id}`);
  };

  return (
    <>
    <div
      className="relative z-10"
      onMouseEnter={() => setIsAutoplayActive(false)} // Stop autoplay when mouse enters
      onMouseLeave={() => setIsAutoplayActive(true)} // Resume autoplay when mouse leaves
    >
      <Carousel style={{ borderRadius: '15px' }} className="flex flex-col xl:flex-row gap-4 z-10">
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            className={index === currentIndex ? "block" : "hidden"}
          >
            <div
              className="relative h-[300px] xl:h-[400px] w-full bg-cover bg-center rounded-md"
              style={{ backgroundImage: `url(${image.url})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white p-4">
                <h2 className="text-2xl font-semibold mb-4">{image.title}</h2>
                <p className="mb-4">{image.description}</p>
                <Button
                  className="bg-white rounded text-black hover:bg-gray-200"
                  onClick={() => (window.location.href = image.link)}
                >
                  {image.text}
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
    
    <div className="relative p-4 dark:bg-gray-800 dark:text-white">
      <h2 className="text-2xl font-semibold mb-6">Témoignages inspirants</h2>
      <div className="mt-4 mb-4 flex justify-between">
        <Button onClick={handlePrev} className="bg-gray-500 text-white rounded-full">
          ←
        </Button>
        <Button onClick={handleNext} className="bg-gray-500 text-white rounded-full">
          →
        </Button>
      </div>
    </div>
  
    <div className="mb-6">
      <Carousel style={{ borderRadius: '15px' }}  className="flex items-center relative">
        <div
          ref={carouselRef}
          className="flex overflow-x-scroll gap-4 w-full scrollbar-hide"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.slice(currentIndex, currentIndex + itemsPerView).map((item) => (
            <div
              key={item.id}
              className={`flex-shrink-0 ${itemsPerView === 2 ? "w-1/2" : "w-1/3"} p-2`}
              onClick={(event) => handleItemClick(event, item)} // Pass both event and item
            >
              <div
                className="relative h-48 bg-cover bg-center rounded-md"
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
  </>
  

  
    
  );
};

export default StudentPage;
