import { useState, useEffect, useRef } from "react";

export function ToolsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  // Define the type of the ref explicitly
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
    <button
      onClick={toggleDropdown}
      className="rounded-md bg-white text-gray-700  h-[50px] w-[50px] hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      <span className="h-[20px] w-[20px]">🛡️</span>
    </button>
  
    {isOpen && (
      <div
        ref={dropdownRef} // Attach the ref to the dropdown
        className="absolute mt-2 w-[200px] sm:w-[550px] md:w-[600px] lg:w-[550px] bg-white border rounded-md shadow-lg z-[1001] overflow-auto sm:ml-4 dark:bg-gray-800 dark:border-gray-600"
        tabIndex={0}
      >
        <div className="p-2 font-semibold text-gray-700 dark:text-gray-200">Outils</div>
        <hr className="dark:border-gray-600" />
        <div className="p-2">
          <a
            href="https://www.virustotal.com/gui/home/search"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Scan fichiers
          </a>
          <a
            href="https://nordvpn.com/fr/link-checker/?srsltid=AfmBOopcWGF7w8prDAaxDw7-dKfJEVRkHOrtw5WDR_lTcBksw9OPOadc"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Scan URL
          </a>
          <a
            href="https://nordpass.com/fr/secure-password/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Mot de passe
          </a>
          <a
            href="https://www.africaonlinesafety.com/platform-reporting"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Reseaux sociaux support
          </a>
          <a
            href="https://www.trustedsite.com/safe-browsing"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Evaluateur de site web
          </a>
        </div>
        <hr className="dark:border-gray-600" />
        <div className="p-2">
          <a
            href="https://www.example.com/help"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Help
          </a>
        </div>
      </div>
    )}
  </div>
  
  );
}
