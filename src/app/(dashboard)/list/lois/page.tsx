"use client"
import { fetchLoisItems } from "@/app/action/fetchData";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {
  resultsData,
  role,
} from "@/lib/data";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type LoiItem = {
  id: string;
  title: string;
  country: string;
  image: string;
  link:string;
};


// Component to render each assignment item
const LoiView = ({ loi }: { loi: LoiItem }) => {
  const router = useRouter();

  const handleItemClick = () => {
    // Navigate to the detailed view page with the loi.id as a query parameter
    router.push(`/list/detailLois/${loi.id}`);
  };

  return (
    <div
    className="assignment-item flex items-center border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-lamaPurpleLight dark:hover:bg-gray-700"
    onClick={handleItemClick} // Handle click to navigate
  >
    <Image 
      src={loi.image} 
      alt={loi.title} 
      width={50} 
      height={50} 
      className="mr-4" 
    />
    <div>
      <p className="text-gray-500 dark:text-gray-400">{loi.country}</p>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{loi.title}</h3>
    </div>
  </div>
  
);
}

const ResultListPage = () => {
  const [items, setItems] = useState<LoiItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown


  const countries = ["Cameroun", "Tchad", "RCA", "Gabon", "Congo", "Burundi", " Bénin","Côte d'Ivoire"];


 
  useEffect(() => {
    const loadHistoryItems = async () => {
      try {
        const astuceItems = await fetchLoisItems();
        setItems(astuceItems);
      } catch (error) {
        console.error("Error fetching astuce items:", error);
      }
    };

    loadHistoryItems();
  }, []);


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
    setIsDropdownVisible(false); // Hide dropdown after selection
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.country === selectedCategory)
    : items;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md flex-1 m-4 mt-4 relative">
    {/* TOP */}
    <div className="flex items-center justify-between">
      <h1 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white">
        Lois Cybersécurité en Afrique francophone
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        {/* Filter Button and Dropdown */}
        <div className="flex items-center gap-4 self-end relative">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
            onClick={() => setIsDropdownVisible((prev) => !prev)}
          >
            <Image src="/filter.png" alt="Filter" width={14} height={14} />
          </button>
  
          {isDropdownVisible && (
            <div
              ref={dropdownRef}
              className="absolute top-12 right-0 w-40 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-10"
            >
              <button
                onClick={() => handleFilterChange(null)}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  !selectedCategory ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => handleFilterChange(country)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    selectedCategory === country
                      ? 'font-bold text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  
    {/* SCROLLABLE LIST */}
    <div className="assignment-list overflow-y-auto h-[600px] mt-4">
      {filteredItems.map((loi: LoiItem) => (
        <LoiView key={loi.id} loi={loi} />
      ))}
    </div>
  
    {/* PAGINATION */}
    <Pagination />
  </div>
  
  );
};

export default ResultListPage;
