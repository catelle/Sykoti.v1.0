"use client"
import { fetchCurrentUserData } from "@/app/action/firebaseClient";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import FinanceChart from "@/components/FinanceChart";
import { auth, db } from "@/lib/firebaseSetup";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";


interface UserData {
  uid: string;
  role: string;
  pseudo:string;
  // Add other fields as necessary
}
const SubjectListPage = () => {

  const [role, setRole]= useState();
const [isAdmin, setIsAdmin]= useState(false);
const [user, loading, error]= useAuthState(auth);
const [userData, setUserData] = useState<UserData | null>(null); 
const router= useRouter();
const [token, setToken] = useState<string | null>(null);
  
  
 
if (!token) {
  console.log("no token");
 // router.push("/login");
}

useEffect(() => {
  // Access localStorage on the client
  const token =  localStorage.getItem("ACCESS_TOKEN");
  setToken(token);
}, []); // Empty dependency array ensures it runs once on the client





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
            setUserData(data);
           
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
  
 
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
    {/* LEFT */}
    <div className="w-full lg:w-2/3 flex flex-col gap-8">
      {/* USER CARDS */}
      <div className="flex gap-4 justify-between flex-wrap">
      <div className="w-full h-[500px]">
        <FinanceChart />
      </div>
       
      </div>
      {/* MIDDLE CHARTS */}
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* COUNT CHART */}
        <div className="w-full lg:w-1/3 h-[450px]">
          <CountChart />
        </div>
        {/* ATTENDANCE CHART */}
        <div className="w-full lg:w-2/3 h-[450px]">
          <AttendanceChart />
        </div>
      </div>
      {/* BOTTOM CHART */}
      <div className="w-full h-[500px]">
        <FinanceChart />
      </div>
    </div>
    {/* RIGHT */}
    <div className="w-full lg:w-1/3 flex flex-col gap-8">
      {/* ATTENDANCE CHART */}
     
          <AttendanceChart />
          <CountChart />
    </div>
  </div>
  );
};

export default SubjectListPage;
