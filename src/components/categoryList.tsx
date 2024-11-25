import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";

interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  handleFilterChange: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  handleFilterChange,
}) => {
  // State to toggle the visibility of the category list
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(false);

  // Ref to track the category list container
  const categoryListRef = useRef<HTMLDivElement>(null);

  // Toggle category list visibility
  const toggleCategoryList = () => {
    setIsCategoryListVisible(!isCategoryListVisible);
  };

  // Close the category list when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (categoryListRef.current && !categoryListRef.current.contains(event.target as Node)) {
      setIsCategoryListVisible(false);
    }
  };

  // Set up the event listener for clicks outside the category list
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategorySelect = (category: string) => {
    handleFilterChange(category); // Call the passed handler
    setIsCategoryListVisible(false); // Hide the category list after selection
  };

  return (
   <div>
  {/* "Voir Catégorie" button */}
  <button
    onClick={toggleCategoryList}
    className="flex items-center bg-lamaYellow justify-center px-3 py-1 rounded-full border text-gray-700 font-bold dark:bg-lamaYellow"
  >
    ...
  </button>

  {/* Category list (shown only when `isCategoryListVisible` is true) */}
  {isCategoryListVisible && (
    <div
      ref={categoryListRef}
      className="space-y-2 sm:flex sm:flex-wrap sm:space-x-2 sm:space-y-0"
    >
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategorySelect(category)} // Handle category select
          className={`px-3 py-1 rounded-full border ${
            selectedCategory === category
              ? "bg-lamaYellow text-white font-bold dark:bg-lamaYellow dark:text-white"
              : "bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )}
</div>

  );
};

export default CategoryList;
