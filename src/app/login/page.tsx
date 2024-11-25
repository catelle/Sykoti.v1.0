"use client";
import { auth, db } from "@/lib/firebaseSetup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Error from "next/error";
import { EyeIcon, EyeOffIcon } from "lucide-react";

// Define interface for form data
interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null); // State for general form error

  // Setup form hook with validation
  const methods = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  // onSubmit handler for form
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    setFormError(null);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
  
      if (user.emailVerified) {

        const token = await user.getIdToken();

        // Store the token in localStorage
        localStorage.setItem("ACCESS_TOKEN", token);

        const docRef = doc(db, "usersCollection", user.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const userData = docSnap.data();
          
          // Redirect based on role
          if (userData?.role === "admin") {
            router.push("/student");
          } else if (userData?.role === "user") {
            router.push("/student");
          }
        } else {
          // If not in "usersCollection", check the "clientCollection"
          const clientDocRef = doc(db, "clientCollection", user.uid);
          const clientDocSnap = await getDoc(clientDocRef);
  
          if (clientDocSnap.exists()) {
            const clientData = clientDocSnap.data();
  
            router.push("/parent");
          } else {
            setFormError("User not found in both collections.");
          }
        }
      } else {
        alert("Please verify your email.");
      }
    } catch (error:Error | any) {
      console.error(error);
      setFormError(error.message);
    } 
    setLoading(false);
  };
  

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900">
        <img src="/logo.png" width={150} height={150} />
        <div className="max-w-md mx-auto p-8 bg-white shadow-md rounded">
          <h1 className="text-2xl font-semibold mb-6 text-center">Connexion</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6 space-y-4">
            <FormMessage>{errors.password?.message}</FormMessage>
              {/* Email Field */}
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
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

              {/* Submit Button */}
              <Button disabled={isSubmitting || loading} className="w-full">
                {loading ? "Patientez..." : "Connexion"}
              </Button>

              <p className="mt-4">
  Not Registered? <Link href="/register" className="text-red-500">Inscription</Link>
</p>


              {/* Form error message */}
              {formError && <div className="mt-4 text-red-500 text-sm">{formError}</div>}
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default Login;
