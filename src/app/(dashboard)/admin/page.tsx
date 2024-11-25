"use client"
import {useEffect, useState} from 'react'
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { useRouter } from 'next/navigation';
import {useAuthState} from "react-firebase-hooks/auth"
import { auth, db } from '@/lib/firebaseSetup';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { fetchCurrentUserData } from '@/app/action/firebaseClient';



interface UserData {
  uid: string;
  role: string;
  // Add other fields as necessary
}

const AdminPage =  () => {

const [role, setRole]= useState();
const [isAdmin, setIsAdmin]= useState(false);
const router= useRouter();
const token= localStorage.getItem("ACCESS_TOKEN");
const [user, loading, error]= useAuthState(auth);
const [userData, setUserData] = useState<UserData | null>(null); 
  
  
 
    if (!token) {
      console.log("no token");
     // router.push("/login");
    }


  useEffect(() => {
    const getUserData = async () => {
      if (loading) return; // Wait for auth state to load
      if (error) {
        console.error("Auth error:", error);
        router.push("/login");
        return;
      }
      if (user) {
        const data = await fetchCurrentUserData(user.uid);
        if (data) {
          setUserData(data);
          if (data.role === "admin") {
            setIsAdmin(true); // Only render admin content if the role is correct
          } else {
            console.log("User is not an admin");
            router.push("/login");
          }
        } else {
          console.log("User data not found");
          router.push("/login");
        }
      }
    };
  
    getUserData();
  }, [user, loading, error, router]);
  


 
  



  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Clients" />
          <UserCard type="Utilisateurs" />
          <UserCard type="Campagnes" />
          
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
        <Announcements/>
      </div>
    </div>
  );
};

export default AdminPage;

