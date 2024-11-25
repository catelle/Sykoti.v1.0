"use client"
import React, { useEffect, useState } from 'react';
import { fetchScamsItems } from '@/app/action/fetchData';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseSetup';

interface Scam {
    id: string; // Document ID as string (since Firestore doc IDs are strings)
    image: string; // Image URL or URI
    description: string; // Scam description
    status: string; // Scam status (e.g., 'unverified', 'verified')
    category: string; // Category of the scam
    platform: string; // Platform where the scam occurred
    date: string; // Date of the scam
    content: string; // Detailed content about the scam
    link: string; // URL related to the scam
    evidence: string; // Evidence related to the scam (e.g., screenshots, files)
  }
  

const Submittedalerts: React.FC = () => {
  const [scams, setScam] = useState<Scam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullContent, setShowFullContent] = useState<boolean>(false);


  useEffect(() => {
    const loadScamItems = async () => {
      try {
        const scamItems = await fetchScamsItems();
        setScam(scamItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scam items:', error);
        setError('Failed to load scam items');
        setLoading(false);
      }
    };
    loadScamItems();
  }, []);

 
  const handleDelete = async (id: string) => {
    try {
      const docRef = doc(db, 'ScamCollection', id);
      await deleteDoc(docRef);
      setScam(scams.filter(scam => scam.id !== id));
    } catch (error) {
      console.error("There was an error deleting the alert!", error);
    }
  };

 

  const handleVerify = async (id: string) => {
    try {
      // Get the reference to the scam document
      const docRef = doc(db, 'ScamCollection', id);
      
      // Update the scam document status to 'verified'
      await updateDoc(docRef, { status: 'verified' });
  
      // Update the local state to reflect the change
      setScam(
        scams.map((scam) => (scam.id === id ? { ...scam, status: 'verified' } : scam))
      );
    } catch (error) {
      console.error('There was an error verifying the scam!', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
 
    // return <div className="p-4 text-center">You must be admin to access this area.</div>;

  return (
    <div className="space-y-6">
    {scams
      .filter((scam) => scam.status === 'unverified')
      .map((scam) => (
        <div
        style={{ borderRadius: '10px' }}
          className="flex flex-col md:flex-row mt-4 ml-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md p-4"
          key={scam.id}
        >
          {/* Image Section */}
          <div className="relative">
            <img
              src={`http://localhost:8001/${scam.image}`}
              alt={scam.description}
              className="w-36 h-36 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            />
            {scam.status === 'verified' && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg">
                ✓
              </div>
            )}
          </div>
  
          {/* Content Section */}
          <div className="flex-1 ml-4">
            <h5 className="text-xl font-semibold text-gray-900 dark:text-white">{scam.description}</h5>
            {!showFullContent ? (
              <button
                className="mt-2 text-blue-600 hover:underline dark:text-blue-400"
                onClick={() => setShowFullContent(true)}
              >
                Voir plus
              </button>
            ) : (
              <div className="mt-2">
                <p className="text-gray-800 dark:text-gray-300">{scam.content}</p>
                <button
                  className="mt-2 text-blue-600 hover:underline mr-2 dark:text-blue-400"
                  onClick={() => (window.location.href = scam.link)}
                >
                  Complet
                </button>
                <button
                  className="mt-2 text-blue-600 hover:underline dark:text-blue-400"
                  onClick={() => setShowFullContent(false)}
                >
                  Voir moins
                </button>
              </div>
            )}
            <div className="mt-2 space-x-2">
              <button
              style={{ borderRadius: '10px' }}
                className="bg-gray-800 dark:bg-gray-700 text-white py-2 px-4 rounded-md"
                onClick={() => handleVerify(scam.id)}
              >
                Verifier
              </button>
              <button
              style={{ borderRadius: '10px' }}
                className="bg-red-600 text-white py-2 px-4 rounded-md"
                onClick={() => handleDelete(scam.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
  </div>
  
  );
};

export default Submittedalerts;
