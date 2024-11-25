import { fetchCurrentUserData } from "@/app/action/firebaseClient";
import { auth, db } from "@/lib/firebaseSetup";
import { collection, query, where } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { stringOrDate } from "react-big-calendar";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

const UserCard = ({ type }: { type: string }) => {
      const [number, setNumber]= useState(0);
      const router = useRouter();
      const [role, setRole] = useState("");
      const [pseudo, setPseudo] = useState("");
      const [photo, setPhoto] = useState("");
     const token= localStorage.getItem("ACCESS_TOKEN");
     const [user, loading, error]= useAuthState(auth);
  // const [userData, setUserData] = useState<UserData | null>(null); 
    
    
    useEffect(() => {
      if (!token) {
        router.push("/login");
      }
    }, [token, router]);
  
    useEffect(() => {
      const getUserData = async () => {
          if (loading) return; // Wait for loading to finish
          if (error) {
              console.error("Error in auth state:", error);
              router.push("/login");
              return;
          }
          if (user) {
              // Ensure user is defined before accessing uid
              const data = await fetchCurrentUserData(user.uid); // Pass the user.uid directly
              if (data) {
                
                setPseudo(data.pseudo);
                setRole(data.role);
                setPhoto(data.photo);
                
              } else {
                  console.log("User not found in both collections");
                  router.push("/login");
              }
          } else {
              console.log("No user is logged in");
              router.push("/login");
          }
      };
  
      getUserData();
  }, [user, loading, error, router]); // Add dependencies here
  


      useEffect(() => {
        if (role === "admin") {
          if (type === "Clients") {
            setNumber(201);
          } else if (type === "Campagnes") {
            setNumber(30);
          } else if (type === "Utilisateurs") {
            setNumber(3000);
          } else {
            setNumber(3000);
          }
        } else if (role === "client") {
          if (type === "SA index") {
            setNumber(10);
          } else if (type === "Campagnes") {
            setNumber(20);
          } else {
            setNumber(100);
          }
        } else if (role === "user") {
          if (type === "Exercices fait") {
            setNumber(10);
          } else if (type === "Score de sensibilisation") {
            setNumber(20);
          } else {
            setNumber(100);
          }
        }
      }, [role, type]); // role and type must be in the dependency array
      
    
    
   
    
  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{number}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
};

export default UserCard;
