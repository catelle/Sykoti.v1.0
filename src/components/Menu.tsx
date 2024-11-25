"use client"
import { fetchCurrentUserData } from "@/app/action/firebaseClient";
// import { role } from "@/lib/data";
import { auth, db } from "@/lib/firebaseSetup";
import { signOut } from "firebase/auth";
import { collection, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
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

const Menu = () => {

  const router= useRouter();
  const [pseudo, setPseudo] = useState("");
  const [role, setRole] = useState("");
  const [user, loading, error]= useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null); 
  let token: string | null = null;
    
  if (typeof window !== "undefined") {
    token = localStorage.getItem("ACCESS_TOKEN");
  }
  
    useEffect(() => {
      if (!token) {
        router.push("/");
      }
    }, [token, router]);
  
    useEffect(() => {
      const getUserData = async () => {
          if (loading) return; // Wait for loading to finish
          if (error) {
              console.error("Error in auth state:", error);
              setRole("invite");
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
              } else {
                setRole("invite")
                  console.log("User not found in both collections");
                  //router.push("/login");
              }
          } else {
            setRole("invite")
              console.log("No user is logged in");
             // router.push("/login");
          }
      };
  
      getUserData();
  }, [user, loading, error, router]); // Add dependencies here
  
    
  
 
   // Function to determine the href based on the role
   const getHomeHref = (role: string) => {
    if (role === "admin") {
      return "/admin";
    } else if (role === "client") {
      return "/parent";
    } else if (role === "user") {
      return "/student";
    } else {
      return "/"; // default home route if no matching role
    }
  };

  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/student",
          visible: [ "admin", "user", "invite"],
        },
        {
          icon: "/teacher.png",
          label: "Mes Clients",
          href: "/list/clients",
          visible: ["Sadmin"],
          onClick: () => {
            window.location.href = "/list/parents"; // Forces a full reload
          },
        },        
        {
          icon: "/student.png",
          label: "Mes Admins",
          href: "/list/clients",
          visible: ["Sadmin"],
        },
        {
          icon: "/parent.png",
          label: "Mes partenaires",
          href: "/list/students",
          visible: ["Sadmin"],
        },
        // {
        //   icon: "/subject.png",
        //   label: "Tendances",
        //   href: "/list/tendances",
        //   visible: ["Sadmin","client", "admin"],
        // },
        // {
        //   icon: "/class.png",
        //   label: "Contenus",
        //   href: "/list/contenus",
        //   visible: ["admin", "Sadmin"],
        // },
        // {
        //   icon: "/lesson.png",
        //   label: "Mes campagnes",
        //   href: "/list/campagnes",
        //   visible: ["client","admin"],
        // },
        {
           icon: "/lesson.png",
          label: "ScamsToV",
          href: "/list/forms/Vscam",
          visible: ["admin"],
        },
        
        {
          icon: "/assignment.png",
          label: "Mes astuces",
          href: "/list/astuces",
          visible: ["user","admin","invite"],
        },
        {
          icon: "/result.png",
          label: "Lois pays",
          href: "/list/lois",
          visible: ["user","admin","invite"],
        },
        {
          icon: "/attendance.png",
          label: "Alerte Scam",
          href: "/list/scams",
          visible: ["Sadmin",  "user", "admin","invite"],
        },
        
        {
          icon: "/message.png",
          label: "Temoignages",
          href: "/list/temoignage",
          visible: ["Sadmin", "admin", "user","invite"],
        },
        {
          icon: "/announcement.png",
          label: "News",
          href: "/list/news",
          visible: ["Sadmin", "admin","user","invite"],
        },
       
        {
          icon: "/calendar.png",
          label: "Cyberambassador",
          href: "/list/events",
          visible: [ "admin","user"],
        },
        {
          icon: "/lesson.png",
          label: "Urgences",
          href: "/list/urgences",
          visible: ["Sadmin", "admin"],
        },
       
        {
          icon: "/subject.png",
          label: "addNews",
          href: "/list/forms/news",
          visible: ["Sadmin", "admin"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: "/heart.png",
          label: "Dons",
          href: "/donate",
          visible: ["Sadmin", "admin", "user","invite"],
        },
        // {
        //   icon: "/setting.png",
        //   label: "Settings",
        //   href: "/settings",
        //   visible: ["Sadmin", "admin", "user", "client"],
        // },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "/logout",
          visible: ["Sadmin", "admin", "user", "client"],
        },
      ],
    },
  ];


   // Handle logout function
   const handleLogout = async () => {
    try {
      await signOut(auth); // Logs out the user using Firebase Auth
      router.push("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="mt-4 z-10 text-sm dark:text-gray-300">
    {menuItems.map((menuSection) => (
      <div className="flex flex-col gap-2" key={menuSection.title}>
        <span className="hidden lg:block text-gray-500 dark:text-gray-400 font-light my-4">
          {menuSection.title}
        </span>
        {menuSection.items.map((item) => {
          // Ensure to only render items that the user's role can see
          if (item.visible.includes(role)) {
            if (item.label === "Logout") {
              return (
                <button
                  onClick={handleLogout} // Handle logout here
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 dark:text-gray-300 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight dark:hover:bg-gray-700"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </button>
              );
            } else {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 dark:text-gray-300 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight dark:hover:bg-gray-700"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          }
          return null; // Return null if the item is not visible
        })}
      </div>
    ))}
  </div>
  
  );
};

export default Menu;
