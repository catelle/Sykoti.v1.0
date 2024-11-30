"use client"
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, studentsData } from "@/lib/data";
import { db } from "@/lib/firebaseSetup";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: number; // Ensure you have an ID for each user
  role: string;
  firstName: string;
  lastName: string;
  email?: string;
  photo: string;
  pseudo: string;
  phone?: string;
  status:string;
  client:string;
};


const columns = [
  {
    header: "Pseudo utilisateur",
    accessor: "name",
  },
  {
    header: "Email",
    accessor: "email",
    className: "hidden md:table-cell",
  },
  {
    header: "Pseudo",
    accessor: "pseudo",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Client",
    accessor: "client",
    className: "hidden lg:table-cell",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];


const fetchUser = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(collection(db, "usersCollection"));
  const users = querySnapshot.docs.map((doc) => {
  const datas = doc.data();
    // Ensure that each document contains the required fields for User type
    return {
      id: doc.id,
      firstName: datas.firstName || "", // Optional field
      lastName: datas.lastName || "",
      email: datas.email || "No Email", // Optional field, defaults to "No Email"
      pseudo: datas.pseudo || "N/A", // Default to "N/A" if missing
      phone: datas.phone || "No Phone", // Provide default
      role: datas.role || "No Role", // Provide default
      status:datas.status||"",
      client:datas.client||""
    };
  }) as unknown as User[]; // Cast to User[] to match your type

  // Log the users and their roles for debugging
  console.log("Users before filtering:", users);

  // Filter users to get only those with role "user" or an empty string
  const filteredUsers = users.filter(user => {
    console.log(`Checking user: ${user.firstName} with role: ${user.role}`);
    return user.role === "user" || user.role === "";
  });

  // Log the filtered users
  console.log("Filtered users:", filteredUsers);

  return filteredUsers;
};



const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
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
    const getUsers = async () => {
      const UserData = await fetchUser();
      setUsers(UserData);
    };

    getUsers();
  }, []);

  const renderRow = (item: User) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        
       
          <h3 className="font-semibold">{` ${item.lastName}`}</h3>
          <p className="text-xs text-gray-500">{item.pseudo}</p>
       
      </td>
      <td className="hidden md:table-cell">{item.email}</td>
      <td className="hidden md:table-cell">{item.pseudo}</td>
      <td className="hidden lg:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.client}</td>
     
      <td className="hidden md:table-cell">
      <span
        className={`${
          item.status.toLowerCase() === "active"
            ? "text-green-500 font-semibold"
            : "text-red-500 font-semibold"
        }`}
      >
        {item.status}
      </span>
    </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="student" type="create" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );
  
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    {/* TOP */}
    <div className="flex items-center justify-between">
      <h1 className="hidden md:block text-lg font-semibold">Liste utilisateurs</h1>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <TableSearch />
        <div className="flex items-center gap-4 self-end">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
            <Image src="/filter.png" alt="" width={14} height={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
            <Image src="/sort.png" alt="" width={14} height={14} />
          </button>
          {role === "admin" && (
            <FormModal table="student" type="delete" />
          )}
        </div>
      </div>
    </div>
    {/* LIST */}
    <Table columns={columns} renderRow={renderRow} data={users} />
    {/* PAGINATION */}
    <Pagination />
  </div>
);
};
export default UserListPage;
