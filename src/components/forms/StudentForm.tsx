"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import PhoneInput from "react-phone-input-2";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createUserWithEmailAndPassword, updatePassword } from "firebase/auth";
import { auth, db } from "@/lib/firebaseSetup";
import { doc, setDoc, updateDoc } from "firebase/firestore";



const schema = z.object({
  name: z.string().min(1, "Saisissez votre nom"),
  pseudo: z.string().min(1, "Saisissez votre pseudo"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
  passwordConfirmation: z.string().min(6, "La confirmation du mot de passe est requise"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  photo: z.any().optional(),
});


type Inputs = z.infer<typeof schema>;

const StudentForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const methods = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = methods;

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const uploadFile = async (file: File) => {
    const storage = getStorage();
    const storageRef = ref(storage, `profilePhotos/${file.name}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref); // returns the download URL of the uploaded image
  };
  
  // Modify the onSubmit to handle photo upload
  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setFormError("");
  
    try {
      let photoURL = null;
  
      if (data.photo?.[0]) {
        // If a photo is uploaded, handle the file upload
        photoURL = await uploadFile(data.photo[0]);
      }
  
      if (type === "create") {
        // Create user and store photoURL in Firestore
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
  
        await setDoc(doc(db, "usersCollection", user.uid), {
          name: data.name,
          pseudo: data.pseudo,
          email: data.email,
          phone: data.phone,
          photoURL: photoURL || null, // store photo URL or null if not uploaded
        });
      } else if (type === "update" && data.email) {
        // Update user in Firestore
        const userRef = doc(db, "usersCollection", data.email);
        await updateDoc(userRef, {
          name: data.name,
          pseudo: data.pseudo,
          phone: data.phone,
          photoURL: photoURL || null,
        });
  
        if (data.password) {
          await updatePassword(auth.currentUser!, data.password);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  });

  function setValue(arg0: string, files: FileList | null) {
    throw new Error("Function not implemented.");
  }

  return (
    <FormProvider {...methods}>
      <div className="flex justify-center p-20 items-center bg-gray-900">
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            {type === "create" ? "Créer un compte" : "Mettre à jour le compte"}
          </h1>
          {formError && (
            <div className="mt-4 text-red-500 text-sm">{formError}</div>
          )}
          <form onSubmit={onSubmit}>
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
              <FormField
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
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
                      <Input {...field} type="password" placeholder="Mot de passe" disabled={loading} />
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
                      <Input {...field} type="password" placeholder="Confirmer le mot de passe" disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Patientez..." : type === "create" ? "Ajouter" : "Mettre à jour"}
            </Button>

            <p className="mt-4 text-sm">
              Déjà inscrit? <a href="/login" className="text-blue-500">Se connecter</a>
            </p>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default StudentForm;
