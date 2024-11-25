"use client"
import React, { useRef, useState, FormEvent, ChangeEvent } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/lib/firebaseSetup';
import { Button } from '@/components/ui/button';

const Addscam: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for button
  const evidenceRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const incidentdateRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const platformRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const [errors, setErrors] = useState<{ general?: string[] } | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handlePlatformChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(event.target.value);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  interface ScamPayload {
    description: string | undefined;
    date: string | undefined;
    evidence: string | undefined;
    platform: string | undefined;
    content: string | undefined;
    category: string | undefined;
    status: string;
    image?: string; // Make the image property optional
  }
  
  const handleConfirm = async (ev: FormEvent) => {
    ev.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const payload: ScamPayload = {
        description: descriptionRef.current?.value,
        date: incidentdateRef.current?.value,
        evidence: evidenceRef.current?.value,
        platform: platformRef.current?.value,
        content: contentRef.current?.value,
        category: categoryRef.current?.value,
        status: 'unverified',
      };
  
      const file = imageRef.current?.files?.[0];
      let imageUrl = '';
  
      if (file) {
        try {
          const storageRef = ref(storage, `images/${file.name}`);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        } catch (error) {
          console.error('Error uploading file:', error);
          return;
        }
      }
  
      payload.image = imageUrl;
  
      await addDoc(collection(db, 'ScamCollection'), payload);
      alert('Document successfully written!');
      showNotification();
    } catch (error) {
      console.error('Error adding document: ', error);
      setErrors({ general: ['An error occurred while adding the scam item.'] });
    } finally {
      setIsLoading(false); // End loading
    }
    setShowModal(false);
  };
  

  const handleCancel = () => {
    setShowModal(false);
  };

  const showNotification = () => {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.style.display = 'block';
      setTimeout(() => {
        notification.style.display = 'none';
      }, 3000);
    }
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
   
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-6">


 <form  style={{ borderRadius: '15px' }} className="bg-white dark:bg-gray-800 border border-0 w-full max-w-2xl shadow-lg rounded-lg p-6 space-y-6" onSubmit={handleConfirm}>
 <div className="text-center mb-8">
   <h1 className="text-3xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
   Arnaque repéré
   </h1>
  
 </div>   {errors && (
      <div className="bg-red-100 text-red-700 p-4 rounded mb-6 dark:bg-red-900 dark:text-red-300">
        {errors.general?.map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </div>
    )}

    {/* Form Fields */}
    <div className="mb-6">
      <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de l'Incident:</label>
      <input
        ref={incidentdateRef}
        style={{ borderRadius: '5px' }}
        type="date"
        id="incidentDate"
        name="incidentdate"
        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200 "
        required
      />
    </div>

    <div className="mb-6">
      <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platform:</label>
      <select
        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200 "
        value={selectedPlatform}
        onChange={handlePlatformChange}
        style={{ borderRadius: '5px' }}
        ref={platformRef}
        aria-label="Default select example"
      >
        <option value="">Sélectionnez une platforme</option>
        <option value="whatsapp">Whatsapp</option>
        <option value="telegramme">Telegramme</option>
        <option value="facebook">Facebook</option>
        <option value="appels">Appels</option>
        <option value="message">Message</option>
        <option value="instagram">Instagram</option>
        <option value="banque">Instagram</option>
        <option value="mobilemoney">Mobile Money</option>
        <option value="email">Email</option>
        <option value="autres">Autres</option>
      </select>
    </div>

    <div className="mb-6">
      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categorie:</label>
      <select
        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200 "
        value={selectedCategory}
        style={{ borderRadius: '5px' }}
        onChange={handleCategoryChange}
        ref={categoryRef}
        aria-label="Default select example"
      >
        <option value="">Sélectionnez une categorie de cybercrime</option>
        <option value="escroquerie">Escroquerie</option>
        <option value="cyberharcelement">Cyberharcelement</option>
        <option value="cyberviolence">Cyberviolence</option>
        <option value="cyberdiscipline">Cyberdiscipline</option>
        <option value="cyberintimidation">Cyberdintimidation</option>
        <option value="autres">Autres</option>
      </select>
    </div>

    <div className="mb-6">
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Introduction:</label>
      <textarea
        ref={descriptionRef}
        style={{ borderRadius: '5px' }}
        id="description"
        name="description"
        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200 "
        rows={5}
        required
      />
    </div>

    <div className="mb-6">
      <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description de l'Escroquerie:</label>
      <textarea
        ref={contentRef}
        style={{ borderRadius: '5px' }}
        id="content"
        name="content"
        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200 "
        rows={5}
        required
      />
    </div>

    <div className="mb-6">
      <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preuves (Liens, textes etc.)</label>
      <input
        ref={evidenceRef}
        style={{ borderRadius: '5px' }}
        type="text"
        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200 "
        id="evidence"
        placeholder=""
        required
      />
    </div>

    <div className="mb-6">
      <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preuves (Captures d'écran, etc.)</label>
      <div className="mt-2">
        <input
          ref={imageRef}
          style={{ borderRadius: '5px' }}
          type="file"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200 "
          id="image"
          aria-describedby="fileHelp"
        />
      </div>
    </div>

    <div className="mb-6">
      <Button
        onClick={handleConfirm}
        style={{ borderRadius: '5px' }}
        className="w-full text-white py-2 px-4 rounded-lg focus:outline-none "
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? "Patientez..." : "Ajouter L'Escroquerie"} {/* Change button text when loading */}
      </Button>
    </div>
  </form>
</div>

  );
};

export default Addscam;
