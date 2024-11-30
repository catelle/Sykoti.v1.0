"use client"

import { fetchCurrentUserData } from "@/app/action/firebaseClient";
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import BigCalendar from "@/components/BigCalender";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
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

const ParentPage = () => {
  const router= useRouter();
  const [pseudo, setPseudo] = useState("");
  const [user, loading, error]= useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);  
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true); // Mark as client-side
    const token = localStorage.getItem("ACCESS_TOKEN");
    setToken(token);
  }, []);

  if (!isClient) {
    return null; // Avoid rendering on the server
  }
  
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
                setPseudo(data.pseudo);
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
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">

      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="SA index" />
          <UserCard type="Campagnes" />
          <UserCard type="Employés" />

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
        <EventCalendar />
        <Announcements />
      </div>
    </div>
      );
    };
    
      {/* <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({pseudo})</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
  {/* <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div> */}
    
 
export default ParentPage;
