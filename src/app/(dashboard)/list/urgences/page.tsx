"use client";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, deleteDoc, updateDoc, doc, getDoc, addDoc, DocumentReference, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebaseSetup";
import { fetchUrgencesItems } from "@/app/action/fetchData";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

type UrgItem = {
  id: string;
  image: string;
  message: string;
  moyen_contact: string;
  addinfo: string;
  categorie: string;
  date: string;
  description: string;
  name: string;
  pays: string;
  platform: string;
  solution: string;
  status: string;
  userid: string;
};

type Message = {
  archive:string;
  read: string;
  message: string;
  timestamp:string;
  userid:string;
  image: string; 
  parts:Section[]; // Change to match Modal's expected type
};
type Section = {
  title: string;
  content: string;
  image: File | null;  // Change to match Modal's expected type
};
// Component to render each Urgence item
const UrgenceView = ({ urgItem }: { urgItem: UrgItem }) => (
  <div className="flex flex-col md:flex-row border-b border-gray-200 p-4 hover:bg-gray-50 transition">
    <Image
      src={urgItem.image}
      alt={urgItem.description}
      width={50}
      height={50}
      className="w-16 h-16 rounded-lg shadow-md mb-4 md:mb-0 md:mr-4"
    />
    <div className="flex-1">
      <h3 className="text-lg font-semibold">{urgItem.name}</h3>
      <p className="text-gray-600">{urgItem.categorie}</p>
      <p className="text-sm text-gray-500">{urgItem.date}</p>
      <p className="text-gray-800 mt-1">{urgItem.description}</p>
    </div>
  </div>
);

const UrgenceListPage = () => {
  const [urgences, setUrgences] = useState<UrgItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null); // New state for expanded item
  const [selecteduserid, setSelecteduserid] = useState(null);
  const [selected, setSelected] = useState<DocumentReference<DocumentData> | null>(null);

  useEffect(() => {
    const loadUrgItems = async () => {
      try {
        const urgItems = await fetchUrgencesItems();
        setUrgences(urgItems);
      } catch (error) {
        console.error("Error fetching scam items:", error);
        setError("Failed to load items.");
      }
    };
    loadUrgItems();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const docRef = doc(db, 'UrgenceCollection', id);
      await deleteDoc(docRef);
      setUrgences(urgences.filter(urgence => urgence.id !== id));
    } catch (error) {
      console.error("There was an error deleting the alert!", error);
    }
  };

  const handleVerify = (id: SetStateAction<string | null>) => {
    setSelectedAlert(id);
    setShowModal(true);
  };

  // Function to upload the image to Firebase Storage and get its URL
  const uploadImage = async (image: File) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${image.name}`);
  
    try {
      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, image);
      
      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL; // Return the URL to be stored in Firestore
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  

  
  const onSubmit = async (formData: Section[]) => {
    try {
      if (formData.length > 0 && selectedAlert) {
        const [firstSection] = formData;
        const docRef = doc(db, 'UrgenceCollection', selectedAlert);
        const docSnap = await getDoc(docRef);
  




        if (docSnap.exists()) {
          const userId = docSnap.data().userid;
  
          // Upload the image if it's a valid File object
          let imageUrl = "";
          if (firstSection.image && firstSection.image instanceof File) {
            imageUrl = await uploadImage(firstSection.image); // Upload the image and get the URL
          }
  
          // Prepare the messageData object with the image URL
          const messageData = {
            archive: false,
            userid: userId,
            message: firstSection.title,
            read: false,
            image: imageUrl, // Store the image URL
            timestamp: new Date(),
            sections: formData, // Store the sections array
          };
  
          // Add to the MessageCollection
          await addDoc(collection(db, 'MessageCollection'), messageData);
  
          // Now update the alert document in Firestore
          const updatedAlertData = {
            status: 'solved',
            solution: firstSection.content,
            message: firstSection.title,
            image: imageUrl, // Use the image URL
          };
          await updateDoc(docRef, updatedAlertData);
  
          // Close the modal or handle further UI changes
          setShowModal(false);
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.log("Error submitting data:", error);
    }
  };
  

  
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

 
  return (
    <div className="w-full mx-auto p-4 dark:bg-gray-800">
  <Modal show={showModal} onClose={handleCloseModal} id={selectedAlert} />
  {/* TOP */}
  <div className="flex items-center justify-between">
    <h1 className="hidden md:block text-lg font-semibold text-gray-800 dark:text-white">
      Urgences liste
    </h1>
    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
      <div className="flex items-center gap-4 self-end">
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
          <Image src="/filter.png" alt="" width={14} height={14} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
          <Image src="/sort.png" alt="" width={14} height={14} />
        </button>
      </div>
    </div>
  </div>

  {urgences.length === 0 ? (
    <p className="text-center text-gray-500 dark:text-gray-400">No alerts found</p>
  ) : (
    <div className="space-y-4">
      {urgences.filter(urgence => urgence.status === 'unsolved').map(urgence => (
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row dark:bg-gray-700 dark:text-white" key={urgence.id}>
          <div className={`flex flex-col md:flex-row md:items-start transition-all ${expandedItemId === urgence.id ? 'h-full' : ''}`}>
            <img
              src={urgence.image}
              alt={urgence.description}
              className={`rounded-lg shadow-md mb-4 md:mb-0 md:mr-4 transition-all ${expandedItemId === urgence.id ? 'w-60 h-60' : 'w-16 h-16'}`} // Change size when expanded
            />
            <div className="flex-1 mb-4 md:mb-0 flex flex-col justify-between">
              <h5 className="text-lg font-semibold">{urgence.name}, {urgence.moyen_contact}, {urgence.categorie}</h5>
              <p className="text-gray-500">{urgence.date}</p>
              {!showFullContent && expandedItemId !== urgence.id ? (
                <button className="text-blue-500 hover:underline mt-2" onClick={() => { setExpandedItemId(urgence.id); setShowFullContent(true); }}>
                  Read Full
                </button>
              ) : (
                <div className="mt-2">
                  <p className="text-gray-800 dark:text-gray-300">{urgence.description}</p>
                  <button className="text-blue-500 hover:underline mt-2" onClick={() => { setExpandedItemId(null); setShowFullContent(false); }}>
                    Show Less
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col ml-auto ">
            <Button className="mb-2" onClick={() => handleVerify(urgence.id)}>
              Set as resolved
            </Button>
            <Button onClick={() => handleDelete(urgence.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* PAGINATION */}
  <Pagination />
</div>

  );
};

export default UrgenceListPage;
