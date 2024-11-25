"use client"

import AddClient from "@/components/AddClient";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Button } from "@/components/ui/button";
import { parentsData, role } from "@/lib/data";
import { db } from "@/lib/firebaseSetup";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";

type Client = {
 
  id: number;
  name: string;
  email?: string;
  localisation: string;  // Example field for company name
  phone: string;
  slogan: string;
  status: string;
  type?: string;       // If the client has a slogan
};


const columns = [
  {
    header: "Noms Clients",
    accessor: "name",       // Client's name
  },
  {
    header: "Emails",
    accessor: "email",
    className: "hidden md:table-cell",
  },
  {
    header: "Téléphones",
    accessor: "phone",       // Client's phone number
    className: "hidden lg:table-cell",
  },
  {
    header: "Adresses",
    accessor: "localisation",     // Client's address
    className: "hidden lg:table-cell",
  },
  {
    header: "Secteurs activites",
    accessor: "type",     // Client's address
    className: "hidden lg:table-cell",
  },
  {
    header: "Status",
    accessor: "status",       // Client's name
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",      // For actions like edit or delete
  },
];

const fetchClients = async (): Promise<Client[]> => {

 
 
  const querySnapshot = await getDocs(collection(db, "clientCollection"));
  const clients = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    // Ensure that each document contains the required fields for Client type
    return {
      id: doc.id,
      name: data.name || "Unknown", // Provide default if missing
      email: data.email || "No Email", // Optional field, defaults to "No Email"
      localisation: data.localisation || "N/A", // Default to "N/A" if missing
      phone: data.phone || "No Phone", // Provide default
      type: data.type || "No Address", // Provide default
      slogan: data.slogan || "", // Optional field
      status: data.status || "", // Optional field
    };
  }) as unknown as Client[]; // Cast to Client[] to match your type

  return clients;
};

const ParentListPage = () => {
  const router = useRouter();
  const [form, setForm]= useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const token = localStorage.getItem("ACCESS_TOKEN");
  

  if (!token) {
    console.log("no token");
   // router.push("/login");
  }


  useEffect(() => {
    const getClients = async () => {
      const clientData = await fetchClients();
      setClients(clientData);
    };

    getClients();
  }, []);

  const renderRow = (item: Client) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.type || "No Email"}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.email || "N/A"}</td>
      <td className="hidden md:table-cell">{item.name || "N/A"}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.localisation}</td>
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
          {role === "admin" && (
            <>
              <FormModal table="parent" type="update" data={item} />
              <FormModal table="parent" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    {/* TOP */}
    <div className="flex items-center justify-between">
      {!form && (
        <h1 className="hidden md:block text-lg font-semibold">
          Liste Clients
        </h1>
      )}
      {!form && (
        <Button onClick={() => setForm(true)}>Ajouter client</Button>
      )}
      {!form && (
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
              <FormModal table="parent" type="create" />
            )}
          </div>
        </div>
      )}
    </div>
    {form && <AddClient />}
    {/* LIST */}
    {!form && (
      <>
        <Table columns={columns} renderRow={renderRow} data={clients} />
        <Pagination />
      </>
    )}
  </div>
);
};

export default ParentListPage;
