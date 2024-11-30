"use client";

import { auth, db, storage } from "@/lib/firebaseSetup";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";


const kpiOptions = [
  {
    id: "kpi1",
    label: "KPI 1",
  },
  {
    id: "kpi2",
    label: "KPI 2",
  },
  {
    id: "kpi3",
    label: "KPI 3",
  },
  {
    id: "kpi4",
    label: "KPI 4",
  },
  {
    id: "kpi5",
    label: "KPI 5",
  },
  {
    id: "kpi6",
    label: "KPI 6",
  },
  {
    id: "kpi7",
    label: "KPI 7",
  },
  {
    id: "kpi8",
    label: "KPI 8",
  },
  {
    id: "kpi9",
    label: "KPI 9",
  },
  {
    id: "kpi10",
    label: "KPI 10",
  },
] as const;


// Define the schema for client registration
const clientSchema = z.object({
  name: z.string().min(1, "Saisissez le nom de l'entreprise"),
  slogan: z.string().min(1, "Saisissez le slogan de l'entreprise"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  type: z.string().min(1, "Type de structure requis"),
  logo: z.any().optional(),
  kpiOptions: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
   address: z.string().min(1, "Saisissez l'adresse"),
  license: z.string().optional(),
  license_expiry: z.string().optional(),
  max_users: z.string().optional(),
});
// Define the form data type
type ClientFormData = z.infer<typeof clientSchema>;

const AddClient = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
 
  const methods = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      kpiOptions: ["KPI 1", "KPI 2", "KPI 3", "KPI 4", "KPI 5", "KPI 6", "KPI 7"],
      logo: null, // Ensure the logo is correctly handled in your form state
    },
  });

  const generateLicense = () => {
    // Simple random license number generator
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let license = '';
    for (let i = 0; i < 12; i++) {
      license += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return license;
  };
  

  const {
    handleSubmit,
    register,
    setError,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = async (data: ClientFormData) => {
   
    setLoading(true);
    try {
      // Check if the email is already taken
      const emailQuery = query(collection(db, "clientCollection"), where("email", "==", data.email));
      const querySnapshot = await getDocs(emailQuery);
      if (!querySnapshot.empty) {
        setError("email", { type: "manual", message: "Cet email est déjà pris." });
        setLoading(false);
        return;
      }

      // Create user without password
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, 'AQXZWRTY234977');
      const user = userCredential.user;

      // Upload the logo to Firebase Storage if a file is selected
      let logoURL = "";

      if (data.logo && data.logo[0]) {
        const file = data.logo[0];
        const storageRef = ref(storage, `logos/${user.uid}/${file.name}`);
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
              logoURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

       // Generate license number if not provided
    const license = data.license || generateLicense();
    const license_expiry = data.license_expiry || new Date(); // Customize as necessary


      // Save client data to Firestore, including the logo URL
      await setDoc(doc(db, "clientCollection", user.uid), {
        email: user.email,
        name: data.name,
        slogan: data.slogan,
        phone: data.phone,
        type: data.type,
        logo: logoURL,
        role: "client",
        status: "active",
        address: data.address,
        license: license,
        license_expiry: license_expiry,
        max_users: data.max_users,
        kpi: data.kpiOptions,
      });


      // Send password reset email to the client
      if (user.email) {
        await sendPasswordResetEmail(auth, user.email);
        console.log("password reset email send successfully");
      } else {
        console.error("User email is null");
      }
      

      alert("Client ajouté avec succès. Un lien de réinitialisation du mot de passe a été envoyé.");
      router.push("/list/clients");

    } catch (error) {
      console.log(error);
      setFormError("Une erreur s'est produite lors de la création du client.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <FormProvider {...methods}>
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-md rounded">
        <h1 className="text-2xl font-semibold mb-6 text-center">Ajouter un client</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 space-y-2">

            {/* Name Field */}
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom Entreprise</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom" disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            

            {/* Slogan Field */}
            <FormField
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slogan Entreprise</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Slogan" disabled={loading} />
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
                    <PhoneInput country="cm" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type Structure Field */}
            <FormField
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de Structure</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Services Administratifs">Services Administratifs</SelectItem>
                      <SelectItem value="Services Publics">Services Publics</SelectItem>
                      <SelectItem value="Entreprise">Entreprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
       
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">KPI (Sélectionnez jusqu`&apos;`à 7)</FormLabel>
                <FormDescription>
                  Selectionner les points sur lesquels vous souhaitez travailler au sein de votre equipe.
                </FormDescription>
              </div>
              {kpiOptions.map((kpiOption) => (
                <FormField
                  key={kpiOption.id}
                  name="kpiOnptions"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={kpiOption.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(kpiOption.id)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value ?? []; // Ensure field.value is an array
                            
                              return checked
                                ? field.onChange([...currentValue, kpiOption.id]) // Add item if checked
                                : field.onChange(
                                    currentValue.filter((value: string) => value !== kpiOption.id) // Remove item if unchecked
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {kpiOption.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
          
            {/* License Expiry Date */}
            <FormField
              name="license_expiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d`&apos;`expiration de la licence</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Users */}
            <FormField
              name="max_users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre maximum d`&apos;`utilisateurs</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Max utilisateurs" disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Adresse" disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Form Error */}
          {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}

          <Button type="submit" disabled={loading || isSubmitting} className="w-full">
            {loading ? "Ajout en cours..." : "Ajouter Client"}
          </Button>
        </form>
      </div>
    </div>
  </FormProvider>
  );
};

export default AddClient;
