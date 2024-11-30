"use client";

import { useEffect, useState } from "react";

const ResearchPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const item = searchParams.get("item");
    setSelectedItem(item ? JSON.parse(item) : null);
  }, []);

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
