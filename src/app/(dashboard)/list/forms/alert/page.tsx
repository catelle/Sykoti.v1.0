"use client";
import React, { useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebaseSetup';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fetchCurrentUserData } from '@/app/action/firebaseClient';

interface UserData {
  uid: string;
  role: string;
  pseudo:string;
  photo:string;
  // Add other fields as necessary
}


const Help = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [errors, setErrors] = useState<{ general?: string[] }>({ general: [] });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State for submit button
  const incidentdateRef = useRef<HTMLInputElement | null>(null);
  const platformRef = useRef<HTMLSelectElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const additionalinfoRef = useRef<HTMLTextAreaElement | null>(null);
  const moyen_contactRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const categoryRef = useRef<HTMLSelectElement | null>(null);
  const countryRef = useRef<HTMLSelectElement | null>(null);
  const [pseudo, setPseudo] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState("");
  const [user, loading, error]= useAuthState(auth);
  const router = useRouter();  // Using Next.js router
  const [userData, setUserData] = useState<UserData | null>(null); 
    
  let token: string | null = null;
    
  if (typeof window !== "undefined") {
    token = localStorage.getItem("ACCESS_TOKEN");
  }
    
    useEffect(() => {
      if (!token) {
        router.push("/login");
      }
    }, [token, router]);
  
    useEffect(() => {
      const getUserData = async () => {
          if (loading) return; // Wait for loading to finish
          if (error) {
             // console.error("Error in auth state:", error);
             router.push("/login");
              return;
          }
          if (user) {
              // Ensure user is defined before accessing uid
              const data = await fetchCurrentUserData(user.uid); // Pass the user.uid directly
              if (data) {
                setUserData(data);
                setPseudo(data.pseudo);
                setRole(data.role);
                setPhoto(data.photo);
               // console.log(user.uid);
                
              } else {
                //  console.log("User not found in both collections");
                  router.push("/login");
              }
          } else {
             // console.log("No user is logged in");
             router.push("/login");
          }
      };
  
      getUserData();
  }, [user, loading, error, router]); // Add dependencies here
  

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  // Define a TypeScript interface for your payload structure
  interface Payload {
    name: string;
    description: string;
    Moyen_contact: string;
    date: string;
    addinfo: string;
    platform: string;
    status: string;
    categorie: string;
    pays: string;
    userid: string;
    image?: string; // Optional image property
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
      const category = categoryRef.current?.value || '';
      const payload: Payload = { // Type your payload here
        name: nameRef.current?.value || '',
        description: descriptionRef.current?.value || '',
        Moyen_contact: moyen_contactRef.current?.value || '',
        date: incidentdateRef.current?.value || '',
        addinfo: additionalinfoRef.current?.value || '',
        platform: platformRef.current?.value || '',
        status: 'unsolved',
        categorie: category,
        pays: countryRef.current?.value || '',
        userid: userId,
      };

      const file = imageRef.current?.files?.[0];
      let imageUrl = '';

      if (file) {
        try {
          const storageRef = ref(storage, `images/${file.name}`);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        } catch (error) {
         // console.error('Error uploading file:', error);
          return;
        }
      }

      payload.image = imageUrl; // Now this is valid because `image` is part of the Payload type
      await addDoc(collection(db, 'UrgenceCollection'), payload);
      console.log('Document successfully written!');
      showNotification();
      setIsSubmitting(false);
    } catch (error) {
     // console.log('Error adding document: ', error);
      setErrors({ general: ['An error occurred while adding the scam item.'] });
    }

    setIsSubmitting(false);  // Enable the submit button after submission
  };

  const showNotification = () => {
    alert('Vous serez contacté sous peu');  // Show success message
    router.push('/list/astuces');  // Navigate to the desired route
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsSubmitting(true);  // Disable the submit button
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
    //  console.error('No user is currently signed in.');
      return;
    }

    const userId = user.uid;
    try {
      const category = categoryRef.current?.value || '';
      const payload: Payload = { // Type your payload here
        name: nameRef.current?.value || '',
        description: descriptionRef.current?.value || '',
        Moyen_contact: moyen_contactRef.current?.value || '',
        date: incidentdateRef.current?.value || '',
        addinfo: additionalinfoRef.current?.value || '',
        platform: platformRef.current?.value || '',
        status: 'unsolved',
        categorie: category,
        pays: countryRef.current?.value || '',
        userid: userId,
      };

      console.log(payload);
      const file = imageRef.current?.files?.[0];
      let imageUrl = '';

      if (file) {
        try {
          const storageRef = ref(storage, `images/${file.name}`);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        } catch (error) {
         // console.error('Error uploading file:', error);
          return;
        }
      }

      payload.image = imageUrl; // Now this is valid because `image` is part of the Payload type
      await addDoc(collection(db, 'UrgenceCollection'), payload);
      //console.log('Document successfully written!');
      showNotification();
      setIsSubmitting(false);
    } catch (error) {
     // console.log('Error adding document: ', error);
      setErrors({ general: ['An error occurred while adding the alert item.'] });
    }

    setIsSubmitting(false);  // Enable the submit button after submissi
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    if (incidentdateRef.current) {
      incidentdateRef.current.max = formattedDate;
    }
  }, []);

  return (
   
  
  <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-6">
 

 <form  style={{ borderRadius: '15px' }} className="bg-white dark:bg-gray-800 border border-0 w-full max-w-2xl shadow-lg rounded-lg p-6 space-y-6" onSubmit={handleConfirm}>
 <div className="text-center mb-8">
   <h1 className="text-3xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
   Assistance face aux Cybercrimes
   </h1>
   <h4 className="text-lg sm:text-base md:text-lg text-gray-700 dark:text-gray-200 mt-2">
   Veuillez remplir ce formulaire.
   </h4>
 </div>  {/* {errors.general && (
        <div className="mb-4 p-4 bg-red-100 text-red-800  rounded">
          {errors.general.map((error, idx) => (
            <p key={idx}>{error}</p>
          ))}
        </div>
      )} */}


  
      <div className="mb-4">
        <label htmlFor="incident-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de l&apos;Incident:</label>
        <input
          ref={incidentdateRef}
          type="date"
          id="incidentDate"
          name="incident-date"
          style={{ borderRadius: '10px' }}
          className="mt-1 p-3 w-full border border-gray-300 dark:bg-gray-700 dark:text-gray-200  rounded-md"
          required
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plateform:</label>
        <select
          className="mt-1 block w-full p-3 border border-gray-300  dark:bg-gray-700 dark:text-gray-200  rounded-md"
          value={selectedPlatform}
          style={{ borderRadius: '10px' }}
          onChange={handlePlatformChange}
          ref={platformRef}
          aria-label="Default select example"
        >
          <option value="">Sélectionnez une platforme</option>
          <option value="Whatsapp">Whatsapp</option>
          <option value="Telegramme">Telegramme</option>
          <option value="Facebook">Facebook</option>
          <option value="Appels">Appels</option>
          <option value="Message">Message</option>
          <option value="Instagram">Instagram</option>
          <option value="Email">Email</option>
          <option value="Autres">Autres</option>
        </select>
      </div>
  
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categorie:</label>
        <select
          className="mt-1 block w-full p-3 border border-gray-300  dark:bg-gray-700 dark:text-gray-200  rounded-md"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ borderRadius: '10px' }}
          ref={categoryRef}
          aria-label="Default select example"
        >
          <option value="">Sélectionnez une categorie de cybercrime</option>
          <option value="Escroquerie">Escroquerie(phishing,smishing,vishing,scamming...)</option>
          <option value="Cyberharcelement">Cyberharcelement</option>
          <option value="Cyberviolence">Cyberviolence</option>
          <option value="Cyberdiscipline">Cyberdiscipline</option>
          <option value="Cyberintimidation">Cyberintimidation</option>
          <option value="Catfish">Catfish</option>
          <option value="Autres">Autres</option>
        </select>
      </div>
  
      <div className="mb-4">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pays:</label>
        <select
          className="mt-1 block w-full p-3 border border-gray-300  dark:bg-gray-700 dark:text-gray-200  rounded-md"
          value={selectedCountry}
          onChange={handleCountryChange}
          style={{ borderRadius: '10px' }}
          ref={countryRef}
          aria-label="Default select example"
        >
          <option value="">Sélectionnez votre pays de residence</option>
          <option value="Cameroun">Cameroun</option>
          <option value="France">France</option>
          <option value="Belgique">Belgique</option>
          <option value="Côte d'Ivoire">Côte d`&apos;`Ivoire</option>
          <option value="Autres">Autres</option>
        </select>
      </div>
  
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description:</label>
        <textarea
          ref={descriptionRef}
          id="description"
          name="description"
          style={{ borderRadius: '10px' }}
          rows={4}
          className="mt-1 p-3 w-full border border-gray-300  dark:bg-gray-700 dark:text-gray-200 rounded-md"
          required
        ></textarea>
      </div>
  
      <div className="mb-4">
        <label htmlFor="additionalinfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Informations supplémentaires:</label>
        <textarea
          ref={additionalinfoRef}
          id="additionalinfo"
          name="additionalinfo"
          style={{ borderRadius: '10px' }}
          rows={4}
          className="mt-1 p-3 w-full border border-gray-300  dark:bg-gray-700 dark:text-gray-200  rounded-md"
        ></textarea>
      </div>
  
      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image (optionnel):</label>
        <input
          ref={imageRef}
          style={{ borderRadius: '10px' }}
          type="file"
          id="image"
          className="mt-1 p-3 w-full border border-gray-300  dark:bg-gray-700 dark:text-gray-200 rounded-md"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="moyen_contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Moyen de contact:</label>
        <input
          ref={moyen_contactRef}
          style={{ borderRadius: '10px' }}
          type="text"
          id="moyen_contact"
          name="moyen_contact"
          className="mt-1 p-3 w-full border border-gray-300  dark:bg-gray-700 dark:text-gray-200  rounded-md"
          required
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom:</label>
        <input
          ref={nameRef}
          style={{ borderRadius: '10px' }}
          type="text"
          id="name"
          name="name"
          className="mt-1 p-3 w-full border border-gray-300  dark:bg-gray-700 dark:text-gray-200  rounded-md"
          required
        />
      </div>
  
      <div className="mb-4 text-right">
        <Button
          type="submit"
          style={{ borderRadius: '15px' }}
          disabled={isSubmitting}  // Disable the button while submitting
          className="px-4 py-2 w-full text-white rounded font-semibold rounded-md shadow-md disabled:opacity-50"
        >
          {isSubmitting ? 'Veuillez patienter...' : 'Soumettre'}
        </Button>
      </div>
    </form>
  </div>
  );  
};

export default Help;
