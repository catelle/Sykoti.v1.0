"use client";
import { fetchScamsItems } from "@/app/action/fetchData";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { role } from "@/lib/data";
import { useRouter } from "next/navigation";
import DetailScamModal from "@/components/DatailScamModal";


type ScamItem = {
  id: string;
  description: string;
  status: string;
  image: string;
  category: string;
  platform: string;
  date: string;
  content: string;
  link: string;
};

// Component to render each scam item
const ScamView = ({ scam, onClick }: { scam: ScamItem; onClick: (item: ScamItem) => void }) => {

  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
   // setIsExpanded((prev) => !prev);
  };

  return (
    <div
  className={`border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-lamaPurpleLight dark:hover:bg-gray-700 ${
    isExpanded ? "flex flex-col items-center" : "flex items-center"
  }`}
  onClick={() => onClick(scam)} // Handle click to open modal
>
  <div className="relative">
    <Image
      src={scam.image}
      alt={scam.description}
      width={isExpanded ? 300 : 100}
      height={isExpanded ? 300 : 100}
      className="transition-all duration-300 ease-in-out"
    />
    {/* Display badge only when image is not expanded and status is verified */}
    {!isExpanded && scam.status === "verified" && (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className=" text-2xl text-red-500 font-bold p-1 rounded-full">
        FAKE
        </span>
      </div>
    )}
    {!isExpanded && scam.status !== "verified" && (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className=" bg-orange-500 text-white font-bold p-1 rounded-full">
        Attention
        </span>
      </div>
    )}
  </div>
  <div className={`${isExpanded ? "text-center mt-4" : "ml-4"}`}>
    <p className="text-gray-500 dark:text-gray-400">
      {scam.category} {scam.date}
    </p>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {scam.description}
    </h3>
    {isExpanded && (
      <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
        {scam.content}
      </p>
    )}
    <button
      onClick={handleToggleExpand}
      className="mt-2 text-sm text-blue-500 dark:text-blue-400 hover:underline"
    >
      {isExpanded ? "Show Less" : "Show More"}
    </button>
  </div>
</div>

  );
};

const ScamsPage = () => {
  const [items, setItems] = useState<ScamItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScamItem | null>(null);
  const router = useRouter();

  const platforms = ["telegramme", "appels", "messages", "whatsapp", "facebook"];
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown


  useEffect(() => {
    const loadScamItems = async () => {
      try {
        const scamItems = await fetchScamsItems();
        setItems(scamItems);
      } catch (error) {
       // console.error("Error fetching scam items:", error);
      }
    };
    loadScamItems();
  }, []);

  const handleItemClick = (item: ScamItem) => {
    setSelectedItem(item); // Set the selected item to open the modal
  };

  const closeModal = () => {
    setSelectedItem(null); // Close the modal by setting selectedItem to null
  };

  

   // Close the category list when clicking outside
   const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownVisible(false);
    }
  };

  // Set up the event listener for clicks outside the category list
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleFilterChange = (category: string | null) => {
    setSelectedCategory(category);
    setIsDropdownVisible(false);
  };
  const handleClick = () => {
    router.push("/list/forms/scam");
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.platform === selectedCategory)
    : items;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md flex-1 m-4 mt-4 relative">
    {/* TOP */}
    <div className="flex items-center justify-between">
      <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-white">
        Alertes récentes
      </h1>
  
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-4 self-end relative">
          {/* Filter Button */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
            onClick={() => setIsDropdownVisible((prev) => !prev)}
          >
            <Image src="/img/filter.png" alt="Filter" width={14} height={14} />
          </button>
  
          {/* Dropdown */}
          {isDropdownVisible && (
            <div
              ref={dropdownRef}
              className="absolute top-12 right-0 w-40 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow-lg z-10"
            >
              <button
                onClick={() => handleFilterChange(null)}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  !selectedCategory ? "font-bold" : ""
                }`}
              >
                All
              </button>
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => handleFilterChange(platform)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    selectedCategory === platform ? "font-bold" : ""
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          )}
  
          {/* Create Button */}
          {(role === "admin" || role === "user") && (
            <div
              onClick={handleClick}
              className="cursor-pointer bg-lamaYellow w-8 h-8 flex items-center justify-center rounded-full"
            >
              <Image src={"/img/create.png"} alt="Create Icon" width={16} height={16} />
            </div>
          )}
        </div>
      </div>
    </div>
  
    {/* SCROLLABLE LIST */}
    <div className="assignment-list overflow-y-auto h-[600px] mt-4">
      {filteredItems.map((scam: ScamItem) => (
        <ScamView key={scam.id} scam={scam} onClick={handleItemClick} />
      ))}
    </div>
  
    {/* PAGINATION */}
    <Pagination />
  
    {/* MODAL */}
    {selectedItem && <DetailScamModal item={selectedItem} onClose={closeModal} />}
  </div>
  







  );
};

export default ScamsPage;
