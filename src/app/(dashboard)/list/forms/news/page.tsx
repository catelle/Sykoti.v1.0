"use client";
import React, { useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, storage } from '@/lib/firebaseSetup';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const News = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [errors, setErrors] = useState<{ general?: string[] }>({ general: [] });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State for submit button
  const incidentdateRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const linkRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const countryRef = useRef<HTMLSelectElement | null>(null);

  const router = useRouter();  // Using Next.js router

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  
  // Define a TypeScript interface for your payload structure
  interface Payload {
    link: string;
    title:string;
    description: string;
    date: string;
    country: string;
    image?: string; // Optional image property
    readByUsers: string[];
  }

  const handleConfirm = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('No user is currently signed in.');
      return;
    }

    const userId = user.uid;
    try {
      const payload: Payload = { // Type your payload here
        link: linkRef.current?.value || '',
        title: titleRef.current?.value || '',
        description: descriptionRef.current?.value || '',
        date: incidentdateRef.current?.value || '', 
        country: countryRef.current?.value || '',
        readByUsers: [],
       
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

      payload.image = imageUrl; // Now this is valid because `image` is part of the Payload type
      await addDoc(collection(db, 'NewsCollection'), payload);
      console.log('Document successfully written!');
      showNotification();
    } catch (error) {
      console.error('Error adding document: ', error);
      setErrors({ general: ['An error occurred while adding the scam item.'] });
    }

    setIsSubmitting(false);  // Enable the submit button after submission
  };

  const showNotification = () => {
    alert('Vous serez contacté sous peu');  // Show success message
    router.push('/list/news');  // Navigate to the desired route
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsSubmitting(true);  // Disable the submit button
    handleConfirm();  // Trigger the form submission
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    if (incidentdateRef.current) {
      incidentdateRef.current.max = formattedDate;
    }
  }, []);

  return (
    <div className="flex flex-col justify-center  sm:mt-60 md:mt-68 items-center bg-gray-100 dark:bg-gray-900 min-h-screen  px-4">   
    <div className="text-center mb-8">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Partage News Cybersecurite</h1>
      <h4 className="text-lg text-gray-600 mt-2 dark:text-gray-300">Veuillez remplir ce formulaire.</h4>
    </div>
  
    <form className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" onSubmit={onSubmit}>
      {/* {errors.general && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded dark:bg-red-700 dark:text-red-200">
          {errors.general.map((error, idx) => (
            <p key={idx}>{error}</p>
          ))}
        </div>
      )} */}
  
      <div className="mb-4">
        <label htmlFor="incident-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de l'actualité:</label>
        <input
          ref={incidentdateRef}
          type="date"
          id="incidentDate"
          name="incident-date"
          className="mt-1 p-3 w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image illustrative:</label>
        <input
          ref={imageRef}
          type="file"
          id="image"
          className="mt-1 p-3 w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lien article complet:</label>
        <input
          ref={linkRef}
          type="text"
          id="link"
          name="link"
          className="mt-1 p-3 w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Titre:</label>
        <input
          ref={titleRef}
          type="text"
          id="title"
          name="title"
          className="mt-1 p-3 w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description contenu article:</label>
        <textarea
          ref={descriptionRef}
          id="description"
          name="description"
          rows={5}
          className="mt-1 p-3 w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        ></textarea>
      </div>
  
      <div className="mb-4">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pays:</label>
        <select
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={selectedCountry}
          onChange={handleCountryChange}
          ref={countryRef}
          aria-label="Default select example"
        >
          <option value="">Sélectionnez votre pays de residence</option>
          <option value="cameroun">Cameroun</option>
          <option value="france">France</option>
          <option value="belgique">Belgique</option>
          <option value="côte d'ivoire">Côte d'Ivoire</option>
          <option value="autres">Autres</option>
        </select>
      </div>
  
      <div className="mb-4 text-right">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 text-white font-semibold rounded-md shadow-md disabled:opacity-50"
        >
          {isSubmitting ? 'Veuillez patienter...' : 'Soumettre'}
        </Button>
      </div>
    </form>
  </div>
  

  );
};

export default News;
