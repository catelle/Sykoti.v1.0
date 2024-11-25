"use client"
import { useRouter, useSearchParams } from "next/navigation";


const ResearchPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to access query params
  const item = searchParams.get('item'); // Get the 'item' query parameter
  const selectedItem = item ? JSON.parse(item as string) : null; // Parse the passed item into an object

  return (
    <div>
      <h1>Research Details</h1>
      {selectedItem ? (
        <div className="space-y-4">
          <div>
            <strong>Pays:</strong> {selectedItem.pays}
          </div>
          <div>
            <strong>Platform:</strong> {selectedItem.platform}
          </div>
          <div>
            <strong>Categorie:</strong> {selectedItem.categorie}
          </div>
          <div>
            <strong>Collection Name:</strong> {selectedItem.collectionName}
          </div>
        </div>
      ) : (
        <div>No data found</div>
      )}
    </div>
  );
};

export default ResearchPage;
