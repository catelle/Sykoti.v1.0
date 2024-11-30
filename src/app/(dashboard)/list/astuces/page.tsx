"use client";
import { fetchAstuceItems } from "@/app/action/fetchData";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { assignmentsData, role } from "@/lib/data";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AstuceItem = {
  id: string;
  titre: string;
  category: string;
  image: string;
};


// Component to render each assignment item
const AstuceView = ({ astuce }: { astuce: AstuceItem }) => {
  const router = useRouter();

  const handleItemClick = () => {
    // Navigate to the detailed view page with the loi.id as a query parameter
    router.push(`/list/detailAstuce/${astuce.id}`);
  };
  
  return(
    <div
    className="assignment-item flex items-center border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-lamaPurpleLight dark:hover:bg-lamaPurpleDark"
    onClick={handleItemClick}
  >
    <Image
      src={astuce.image}
      alt={astuce.titre}
      width={50}
      height={50}
      className="mr-4"
    />
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{astuce.titre}</h3>
      <p className="text-gray-500 dark:text-gray-400">{astuce.category}</p>
    </div>
  </div>
  
);
}

const AssignmentListPage = () => {
  const [items, setItems] = useState<AstuceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown

  const categories = ["escroquerie", "cyberdiscipline","cybermediation", "cyberharcelement", "cyberviolence","catfish","ingenieries"];

  useEffect(() => {
    const loadHistoryItems = async () => {
      try {
        const astuceItems = await fetchAstuceItems();
        setItems(astuceItems);
      } catch (error) {
        //console.error("Error fetching astuce items:", error);
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
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  return (
    <div className="bg-white  dark:bg-gray-800 p-4 rounded-md flex-1 m-4 mt-6 relative">
    {/* TOP */}
    <div className="flex items-center justify-between">
      <h1 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white">Astuces pour se protéger en ligne</h1>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        {/* <TableSearch /> */}
        <div className="flex items-center gap-4 self-end relative">
          <button
           className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
           onClick={() => setIsDropdownVisible((prev) => !prev)}
          >
            <Image src="/img/filter.png" alt="Filter" width={14} height={14} />
          </button>
  
          {isDropdownVisible && (
            <div
              ref={dropdownRef}
              className="absolute top-12 right-0 w-40 bg-white dark:bg-gray-700 border rounded shadow-lg z-10"
            >
              <button
                onClick={() => handleFilterChange(null)}
                className={`block w-full text-left px-4 py-2 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 ${!selectedCategory ? 'font-bold' : ''}`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleFilterChange(category)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600 ${selectedCategory === category ? 'font-bold' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  
    {/* SCROLLABLE LIST */}
    <div className="assignment-list overflow-y-auto h-[600px] mt-4">
      {filteredItems.map((astuce: AstuceItem) => (
        <AstuceView key={astuce.id} astuce={astuce} />
      ))}
    </div>
  
    {/* PAGINATION */}
    <Pagination />
  </div>
  
  );
};

export default AssignmentListPage;
