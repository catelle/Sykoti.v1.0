"use client";

import { auth, db, storage } from "@/lib/firebaseSetup";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";
import {  FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { EyeIcon, EyeOffIcon } from "lucide-react";

// Define the schema for registration
const registerSchema = z.object({
  name: z.string().min(1, "Saisissez votre nom"),
  pseudo: z.string().min(1, "Saisissez votre pseudo"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
  passwordConfirmation: z.string().min(6, "La confirmation du mot de passe est requise"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  photo: z.any().optional(),
});

// Define the form data type
type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);


  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      photo: null, // Ensure photo is correctly handled in your form state
    },
  });

  // Destructure the required values from the methods
  const {
    handleSubmit,
    register,
    setError,
    reset,
    setValue, // Adding setValue to manually update fields
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // Check if password and password confirmation match
      if (data.password !== data.passwordConfirmation) {
        setError("passwordConfirmation", {
          type: "manual",
          message: "Les mots de passe ne correspondent pas.",
        });
        setLoading(false);
        return;
      }

      // Check if the pseudo is unique
      const pseudoQuery = query(collection(db, "usersCollection"), where("pseudo", "==", data.pseudo));
      const querySnapshot = await getDocs(pseudoQuery);
      if (!querySnapshot.empty) {
        setError("pseudo", { type: "manual", message: "Ce pseudo est déjà pris." });
        setLoading(false);
        return;
      }

      // Register the user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Upload the image to Firebase Storage if a file is selected
      let photoURL = "";

      // Safely handle the photo upload if a file is selected
      if (data.photo && data.photo[0]) {
        const file = data.photo[0]; // Retrieve the file
        const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            },
            async () => {
              // Get the download URL once the upload is complete
              photoURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Save user data to Firestore, including the photo URL
      await setDoc(doc(db, "usersCollection", user.uid), {
        email: user.email,
        firstName: data.name,
        pseudo: data.pseudo,
        phone: data.phone,
        lastName: "",
        photo: photoURL, // Store the photo URL
        role: "user",
        
        
      });

      // Send email verification
      await sendEmailVerification(user);
      alert("Email de vérification envoyé. Veuillez vérifier votre boîte de réception.");
      router.push("/");

    } catch (error) {
      console.log(error);
      setFormError("Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
     <div className="flex  justify-center items-center bg-gray-900 min-h-screen p-10">
    {/* Left Side - Lottie Animation */}
    {/* <div className="hidden lg:block w-1/2 flex justify-center items-center">
      <div className="max-w-lg">
        
        {/* Replace this with your Lottie animation */}
        {/* <Lottie 
          animationData={animationData} 
          loop 
          autoplay 
          className="w-full h-full" 
        /> 
      </div>
    </div> */}

    {/* Right Side - Form */}
    <div className="w-[400px] lg:w-1/2 max-w-md mx-auto p-6 bg-white shadow-md rounded">
   
    <div className="flex items-center justify-center space-x-2 "><img src="/img/logo.png" width={50} height={50} className="mb-8" /><h1 className="text-2xl font-semibold mb-6 text-center">Créer un compte</h1></div>
          <form onSubmit={handleSubmit(onSubmit)}>
          {formError && (
                <div className="mt-4 text-red-500 text-sm">
                  {formError}
                </div>
              )}
            <div className="mb-6 space-y-2">
              {/* Name Field */}
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pseudo Field */}
              <FormField
                name="pseudo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pseudo</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Pseudo" disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Email" disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             {/* Phone Field */}
{/* Phone Field */}
<FormField
                name="phone"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl  className="w-[400px]">
                      <PhoneInput country={'cm'} {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              {/* Photo Upload Field */}
              <FormField
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo de profil</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={isSubmitting}
                        onChange={(e) => {
                          const file = e.target.files?.[0]; // Handle the file selection
                          field.onChange(e); 
                          setValue("photo", e.target.files); // Update the form state manually
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
            
<FormField
  name="password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Mot de passe</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            {...field}
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            disabled={loading}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Password Confirmation Field */}
<FormField
  name="passwordConfirmation"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Confirmation du mot de passe</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            {...field}
            type={showPassword ? "text" : "password"}
            placeholder="Confirmer le mot de passe"
            disabled={loading}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Patientez..." : "Ajouter"}
              </Button>

              <p className="message">
                Already Registered? <Link href="/" className="text-red-500">Sign in</Link>
              </p>

             
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default Register;