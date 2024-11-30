import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseSetup";
import { useRouter } from "next/navigation";
import DetailScamModal from "./DatailScamModal";


// Define types for search results
interface SearchResult {
  id: string;
  title: string;
  platform: string;
  categorie: string;
  collectionName: string;
  image: string;
}

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

const TableSearch: React.FC = () => {
  const [searchType, setSearchType] = useState<string>("country");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<ScamItem | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const collections = ["Newsollection", "FakCollection", "ScamCollection", "LoisCollection", "historyCollection"];

  const handleSearch = async (): Promise<void> => {
    if (!searchQuery) return;
    setIsLoading(true);
    setResults([]);
    setShowResults(false);

    let allResults: SearchResult[] = [];
    try {
      for (const collectionName of collections) {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, where(searchType, "==", searchQuery.toLowerCase())); // Convert to lowercase for normalization
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const docId = doc.id;
          const docData = doc.data();

          const result: SearchResult = {
            id: docId || "",
            title: docData.title || docData.titre || "",
            platform: docData.platform || "",
            categorie: docData.categorie || "",
            collectionName,
            image: docData.image || docData.imageuri || "/default-image.jpg",
          };

          allResults.push(result);
        });
      }
      setResults(allResults);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const closeModal = () => {
    setSelectedItem(null);
  };

  const handleResultClick = (result: SearchResult) => {
    const { collectionName, id } = result;

    if (collectionName === "LoisCollection") {
      router.push(`/list/detailLois/${id}`);
    } else if (collectionName === "NewsCollection") {
      router.push("/list/news");
    } else if (collectionName === "historyCollection") {
      router.push(`/list/detailsView?id=${id}`);
    } else if (collectionName === "FakCollection" || collectionName === "ScamCollection") {
      router.push(`/list/detailAstuce/${id}`);
    } else {
      console.error("Unknown collection type:", collectionName);
    }

    setShowResults(false);
  };

  return (
    <div ref={searchRef}>
    <div className="flex items-center gap-2 p-2 bg-transparent dark:bg-white dark:border-gray-300 outline-none text-xs rounded-full ring-[1.5px] ring-gray-300">
      <button onClick={handleSearch} className="text-white p-2">
        <Image src="/img/search.png" alt="Search" width={14} height={14} />
      </button>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-[200px] p-2 bg-transparent dark:text-gray-900 outline-none"
      />
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="p-1 bg-transparent dark:text-gray-900 outline-none text-[16px] font-light font-semibold"
      >
        <option value="country">Pays</option>
        <option value="platform">Platform</option>
        <option value="categorie">Catégorie</option>
      </select>
    </div>

    {isLoading && <div className="text-gray-500 dark:text-gray-200">Patientez...</div>}

    {showResults && (
      <div className="absolute top-full left-0 mt-4 dark:bg-gray-900 w-full z-10 bg-white shadow-md rounded-md p-4">
        {results.length > 0 ? (
          <div className="grid grid-cols-5 gap-6">
            {results.map((result, index) => (
              <div key={index} className="cursor-pointer" onClick={() => handleResultClick(result)}>
                <Image src={result.image} alt="" width={90} height={90} className="object-cover rounded-md" />
                <p className=" dark:text-gray-200 mt-2">{result.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-red-500 dark:text-gray-200">Aucun résultat</div>
        )}
      </div>
    )}

    {selectedItem && <DetailScamModal item={selectedItem} onClose={closeModal} />}
  </div>
  
  );
};

export default TableSearch;
