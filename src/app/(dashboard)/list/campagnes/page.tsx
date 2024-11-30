"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {useEffect, useState} from 'react'
import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { useRouter } from 'next/navigation';
import {useAuthState} from "react-firebase-hooks/auth"
import { auth } from '@/lib/firebaseSetup';
import { fetchCurrentUserData } from "@/app/action/firebaseClient";
import { Button } from "@/components/ui/button";
import BigCalendar from "@/components/BigCalender";


interface UserData {
  uid: string;
  role: string;
  // Add other fields as necessary
}



const CampagnePage =  () => {

  const [userData, setUserData] = useState<UserData | null>(null); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);
  const [type1, setType1]= useState("");
  const [type2, setType2]= useState("");
  const [type3, setType3]= useState("");
  const [token, setToken] = useState<string | null>(null);
  
  
 
    if (!token) {
      console.log("no token");
     // router.push("/login");
    }

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
              if (data.role === "admin") {
                  setIsAdmin(true);
                  setType1("Campagnes");
                  setType2("Clients");
                  setType3("Utilisateurs");
              } else if (data.role === "client") {
                setIsClient(true);
                setIsAdmin(true);
                setType1("SA index");
                setType2("Campagnes");
                setType3("Employés");
            }else {
                  router.push("/login");
              }
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
    <div className="p-4 flex flex-col gap-4">
    {/* First Row: User Cards */}
    <div className="flex gap-4 justify-between flex-wrap">
    {isClient && <Button>Nouvelle Campagne</Button>}
      <UserCard type={type1} />
      <UserCard type={type2} />
      <UserCard type={type3} />
     
    </div>
  
    {/* Second Row: Calendar and Attendance Chart */}
    <div className="flex gap-4 w-full">
      <div className="w-full lg:w-2/3 h-full bg-white p-4 rounded-md">
        <h1 className="text-xl font-semibold">Programme Campagnes</h1>
        <BigCalendar />
      </div>
  
      <div className="w-full lg:w-1/3 h-full p-4 rounded-md">
        {/* ATTENDANCE CHART */}
        <h2 className="text-lg font-semibold">Attendance Chart</h2>
        <div className="h-[450px]">
          <AttendanceChart />
        </div>
      </div>
    </div>
  
    {/* Bottom Row: Finance Chart */}
    <div className="w-full h-[500px]">
      <FinanceChart />
    </div>
  </div>
  
  
     
  
  );
};

export default CampagnePage;

