import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a button component in Shadcn
import { auth, db, storage } from '@/lib/firebaseSetup'; // Import Firestore DB
import { collection, addDoc, updateDoc, getDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

interface Section {
  title: string;
  content: string;
  image: File | null; // Store image URL if needed
}

interface ModalProps {
  show: boolean;
  onClose: () => void;
  id:string|null;
 
}

type Message = {
  archive:string;
  read: string;
  message: string;
  timestamp:string;
  userid:string;
  image: string; 
  parts:Section[]; // Change to match Modal's expected type
};

const Modal: React.FC<ModalProps> = ({ show, onClose, id}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [user, loading, error]= useAuthState(auth);
  const [resumeSolution, setResumeSolution] = useState("");


  const handleAddSection = () => {
    setSections([...sections, { title: '', content: '', image: null }]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: keyof Section, value: string | File | null) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  

     // Set submitting state
  setIsSubmitting(true);

    if (!id) {
      throw new Error("Invalid document ID. Cannot proceed with update.");
    }
    
    const docRef = doc(db, 'UrgenceCollection', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const updatedAlertData = {
        status: 'solved',
        solution: resumeSolution,
      };
      await updateDoc(docRef, updatedAlertData);
    } else {
      console.error("No such document!");
    }
    
    const userId = user?.uid; // Replace with actual user ID
    const validSections = sections.filter((section) => section.title && section.content); // Ensure sections are valid
  
    try {
      // Upload images and prepare the sections array
      const uploadedSections = await Promise.all(
        validSections.map(async (section) => {
          let imageUrl = null;
  
          // Check if an image exists and upload it to Firebase Storage
          if (section.image) {
            const imageRef = ref(storage, `sections/${Date.now()}-${section.image.name}`);
            await uploadBytes(imageRef, section.image); // Upload image
            imageUrl = await getDownloadURL(imageRef); // Get image URL
          }
  
          // Return the section with the image URL
          return {
            title: section.title,
            content: section.content,
            image: imageUrl,
          };
        })
      );
  
      // Create the message data to store in Firestore
      const messageData = {
        archive: false,
        userid: userId,
        message: validSections[0]?.title || "No title", // Use the first section's title as the main message
        read: false,
        timestamp: new Date(),
        sections: uploadedSections, // Store the sections array
        resume_solution: resumeSolution, // Include the static field
      };
  
      // Save the message data in Firestore
      const docRef = await addDoc(collection(db, "MessageCollection"), messageData);
      console.log("Document written with ID: ", docRef.id);
  
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data: ", error);
      alert("Failed to submit data.");
    }finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  };
  
  
  

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
    <h2 className="text-xl font-semibold mb-4">Ajouter des Détails</h2>
    <form onSubmit={handleSubmit}>
      {/* Static Field for Résumé Solution */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Résumé de la Solution :</label>
        <textarea
          value={resumeSolution}
          onChange={(e) => setResumeSolution(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows={3}
        />
      </div>

      {/* Dynamic Section Fields */}
      {sections.map((section, index) => (
        <div key={index} className="mb-6 border-b pb-4">
          {/* Section Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Titre :</label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleInputChange(index, 'title', e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contenu :</label>
            <textarea
              value={section.content}
              onChange={(e) => handleInputChange(index, 'content', e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Joindre une image :</label>
            <input
              type="file"
              accept=".jpeg,.jpg,.png,.gif,.svg"
              onChange={(e) => handleInputChange(index, 'image', e.target.files?.[0] || null)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <Button type="button" onClick={() => handleRemoveSection(index)} variant="destructive">
            Supprimer la section
          </Button>
        </div>
      ))}

      <Button type="button" onClick={handleAddSection} variant="outline" className="mb-4">
        Ajouter une section
      </Button>

      <div className="flex justify-end mt-4">
        <Button type="button" onClick={onClose} variant="secondary" className="mr-2" disabled={isSubmitting}>
          Fermer
        </Button>
        <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Veuillez patienter...' : 'Soumettre'}
  </Button>
      </div>
    </form>
  </div>
</div>

  );
};

export default Modal;
