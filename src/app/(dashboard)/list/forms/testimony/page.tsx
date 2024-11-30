"use client"

import React, { useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebaseSetup';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Payload {
  Autor: string;
  email: string;
  introduction: string;
  conclusion: string;
  Date: string;
  developpement: string;
  platform: string;
  title: string;
  storyCat: string;
  country: string;
  imageuri?: string;
}



const Testify: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const incidentdateRef = useRef<HTMLInputElement>(null);
  const additionalinfoRef = useRef<HTMLTextAreaElement>(null);
  const adviceRef = useRef<HTMLTextAreaElement>(null);
  const platformRef = useRef<HTMLSelectElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); 


  // const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
  //   ev.preventDefault();
  //   console.log('show modal');
  //   setShowModal(true);
  // };
  
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(event.target.value);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const handleConfirm = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setIsSubmitting(true); // Disable button and show 'Patientez...'

    if (!nameRef.current || !emailRef.current || !descriptionRef.current || !incidentdateRef.current || !platformRef.current || !categoryRef.current || !countryRef.current || !titleRef.current) {
      setErrors({ general: ['Please fill in all required fields.'] });
      setIsSubmitting(false); // Re-enable button in case of error
   
      return;
    }




    try {
      const payload: Payload = {
        Autor: nameRef.current.value,
        email: emailRef.current.value||'',
        introduction: descriptionRef.current.value,
        conclusion: adviceRef.current?.value || '',
        Date: incidentdateRef.current.value,
        developpement: additionalinfoRef.current?.value || '',
        platform: platformRef.current.value,
        title: titleRef.current.value,
        storyCat: categoryRef.current.value,
        country: countryRef.current.value,
      };

      const file = imageRef.current?.files?.[0];
      if (file) {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        payload.imageuri = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'historyCollection'), payload);
      alert('Témoignage partagé avec succes !');
     router.push('/list/temoignage');
    } catch (error) {
     // console.error('Error adding document: ', error);
      setErrors({ general: ['An error occurred while submitting your testimony.'] });
    } finally{
      setIsSubmitting(false); // Re-enable button after completion
 
    }
  };

  const handleModalSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsSubmitting(true); // Start the submission process

    // Simulate the submission process (e.g., API call or form submission)
    setTimeout(() => {
      // After the form is successfully submitted, navigate to the list page
      router.push('/list/temoignage');
    }, 2000); // You can adjust the time as needed
  };

  const handleCancel = () => {
    setShowModal(false);
  };


  useEffect(() => {
    if (incidentdateRef.current) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      incidentdateRef.current.max = formattedDate;
    }
  }, []);

  return (
<div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-6">
 

  <form  style={{ borderRadius: '15px' }} className="bg-white dark:bg-gray-800 border border-0 w-full max-w-2xl shadow-lg rounded-lg p-6 space-y-6" onSubmit={handleConfirm}>
  <div className="text-center mb-8">
    <h1 className="text-3xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-300">
      Partagez une histoire
    </h1>
    <h4 className="text-lg sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mt-2">
      Aidez à prévenir les risques en ligne.
    </h4>
  </div>
    {/* Error messages */}
    {errors && (
      <div className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded-md p-4">
        {Object.keys(errors).map((key) => (
          <p key={key} className="text-sm">{errors[key][0]}</p>
        ))}
      </div>
    )}

    {/* Date Field */}
    <div>
      <label htmlFor="incident-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Date de l&apos;Incident:
      </label>
      <input
        ref={incidentdateRef}
        style={{ borderRadius: '10px' }}
        type="date"
        id="incidentDate"
        name="incident-date"
        className="mt-1 block w-full p-3 border border-gray-300 dark:bg-gray-700 dark:text-gray-200  rounded-md"
        required
      />
    </div>

    {/* Platform */}
    <div>
      <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Platform:
      </label>
      <select
        value={selectedPlatform}
        onChange={handlePlatformChange}
        style={{ borderRadius: '10px' }}
        ref={platformRef}
        className="mt-1 block w-full p-3 border border-gray-300 dark:bg-gray-700 dark:text-gray-200  rounded-md"
      >
        <option value="">Sélectionnez une platforme</option>
        <option value="whatsapp">Whatsapp</option>
        <option value="telegramme">Telegramme</option>
        <option value="facebook">Facebook</option>
        <option value="appels">Appels</option>
        <option value="message">Message</option>
        <option value="instagram">Instagram</option>
        <option value="email">Email</option>
        <option value="autres">Autres</option>
        <option value="vente">e-commerce</option>
        <option value="banque">Carte/compte bancaire</option>
      </select>
    </div>

    {/* Category */}
    <div>
      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Catégorie:
      </label>
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        style={{ borderRadius: '10px' }}
        ref={categoryRef}
        className="mt-1 block w-full p-3 border border-gray-300 dark:bg-gray-700 dark:text-gray-200  rounded-md"
      >
        <option value="">Sélectionnez une catégorie de cybercrime</option>
        <option value="escroquerie">Escroquerie (phishing, smishing, vishing, scamming...)</option>
        <option value="cyberharcelement">Cyberharcelement</option>
        <option value="cyberviolence">Cyberviolence</option>
        <option value="cyberdiscipline">Cyberdiscipline</option>
        <option value="cyberintimidation">Cyberintimidation</option>
        <option value="catfish">Catfish</option>
       
        <option value="autres">Autres</option>
      </select>
    </div>

    {/* Country */}
    <div>
      <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Pays:
      </label>
      <select
        value={selectedCountry}
        onChange={handleCountryChange}
        style={{ borderRadius: '10px' }}
        ref={countryRef}
        className="mt-1 block w-full p-3 border border-gray-300 dark:bg-gray-700 dark:text-gray-200  rounded-md"
      >
        <option value="">Sélectionnez un pays</option>
        <option value="cameroun">Cameroun</option>
        <option value="côte d'ivoire">Côte d&apos;Ivoire</option>
        <option value="gabon">Gabon</option>
        <option value="autres">Autres</option>
      </select>
    </div>

    {/* Title */}
    <div>
      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Titre:
      </label>
      <input
        ref={titleRef}
        style={{ borderRadius: '10px' }}
        type="text"
        id="title"
        placeholder="Titre pour votre témoignage"
        className="mt-1 block w-full p-3 border rounded-lg border-gray-300 dark:bg-gray-700 dark:text-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Description */}
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Description de l&apos;Incident:
      </label>
      <textarea
        id="description"
        ref={descriptionRef}
        style={{ borderRadius: '10px' }}
        rows={4}
        className="mt-1 p-3 w-full border border-gray-300 dark:bg-gray-700 dark:text-gray-200  rounded-md"
        required
      ></textarea>
    </div>
    <div className="mb-3">
      <label htmlFor="additionalinfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Impact sur Vous:</label>
      <textarea
        id="additionalinfo"
        ref={additionalinfoRef}
        style={{ borderRadius: '10px' }}
        className="mt-1 p-3 w-full border border-gray-300 dark:bg-gray-700 dark:text-gray-200  rounded-md"
        name="impact"
        rows={3}
        required
      ></textarea>
    </div>
    <div className="mb-3">
      <label htmlFor="advice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Suggestions pour les Autres:</label>
      <textarea
        id="advice"
        ref={adviceRef}
        style={{ borderRadius: '10px' }}
        className="mt-1 p-3 w-full border border-gray-300 dark:bg-gray-700 dark:text-gray-200  rounded-md"
        name="suggestions"
        rows={3}
      ></textarea>
    </div>
    <div className="mb-3">
      <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom (Optionnel):</label>
      <input
        type="text"
        ref={nameRef}
        style={{ borderRadius: '10px' }}
        className="mt-1 block w-full p-3 border rounded-lg border-gray-300 dark:bg-gray-700 dark:text-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-500"
        id="name"
        placeholder="Votre nom"
      />
    </div>

    {/* Image */}
    <div className="mb-3">
      <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Ajouter ou une image descriptive:
      </label>
      <div className="input-group">
        <input
          type="file"
          ref={imageRef}
          style={{ borderRadius: '10px' }}
          className="mt-1 p-3 w-full border border-gray-300 dark:bg-gray-700 dark:text-gray-200  rounded-md"
          id="inputGroupFile04"
          aria-describedby="inputGroupFileAddon04"
          aria-label="Upload"
        />
      </div>
    </div>

    {/* Email */}
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Adresse Email:
      </label>
      <input
        ref={emailRef}
        style={{ borderRadius: '10px' }}
        type="email"
        id="email"
        placeholder="Votre email"
        className="mt-1 block w-full p-3 border rounded-lg border-gray-300 dark:bg-gray-700 dark:text-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-500"
       
      />
    </div>

    {/* Submit Button */}
    <div className="flex justify-end">
      <Button
        type="submit"
        style={{ borderRadius: '10px' }}
        className={`px-4 py-2 w-full text-white text-sm font-medium rounded-md shadow ${
          isSubmitting ? 'cursor-not-allowed' : ''
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Patientez...' : 'Envoyer'}
      </Button>
    </div>
  </form>
</div>

   
  );
};

export default Testify;
