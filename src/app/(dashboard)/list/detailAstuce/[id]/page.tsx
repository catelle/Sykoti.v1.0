"use client";

import { MouseEventHandler, useEffect, useState } from "react";
import { fetchAstuceItems, fetchLoisItems } from "@/app/action/fetchData"; // Adjust path if needed
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type AstuceItem = {
    id: string;
    image: string;
    titre: string;
    category: string;
    intro: string;
    date: string;
    conclusion: string;
    T1: string;
    T2: string;
    T3: string;
    T4: string;
    T5: string;
    T6: string;
    T7: string;
    T8: string;
    T9: string;
    T10: string;
    T11: string;
    T12: string;
    T13: string;
    T14: string;
    T15: string;
    P1: string;
    P2: string;
    P3: string;
    P4: string;
    P5: string;
    P6: string;
    P7: string;
    P8: string;
    P9: string;
    P10: string;
    P11: string;
    P12: string;
    P13: string;
    P14: string;
    P15: string;
  };
  
  

const DetailLoiView = () => {
  const { id } = useParams(); // Get the 'id' from the URL
  const [item, setItem] = useState<AstuceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const astuceItems = await fetchAstuceItems();
          const foundItem = astuceItems.find((astuce) => astuce.id === id);
          //console.log(foundItem);
          setItem(foundItem ? {
            id: foundItem.id,
            image: foundItem.image || '',
            titre: foundItem.titre || '',
            conclusion: foundItem.conclusion,
            category: foundItem.category || '',
            intro: foundItem.intro || '',
            date: foundItem.date && foundItem.date.seconds
              ? new Date(foundItem.date.seconds * 1000).toLocaleDateString()
              : '',
            T1: foundItem.t1 || '',
            T2: foundItem.t2 || '',
            T3: foundItem.t3 || '',
            T4: foundItem.t4 || '',
            T5: foundItem.t5 || '',
            T6: foundItem.t6 || '',
            T7: foundItem.t7 || '',
            T8: foundItem.t8 || '',
            T9: foundItem.t9 || '',
            T10: foundItem.t10 || '',
            T11: foundItem.t11 || '',
            T12: foundItem.t12 || '',
            T13: foundItem.t13 || '',
            T14: foundItem.t14 || '',
            T15: foundItem.t15 || '',
            P1: foundItem.P1 || '',
            P2: foundItem.P2 || '',
            P3: foundItem.P3 || '',
            P4: foundItem.P4 || '',
            P5: foundItem.P5 || '',
            P6: foundItem.P6 || '',
            P7: foundItem.P7 || '',
            P8: foundItem.P8 || '',
            P9: foundItem.P9 || '',
            P10: foundItem.P10 || '',
            P11: foundItem.P11 || '',
            P12: foundItem.P12 || '',
            P13: foundItem.P13 || '',
            P14: foundItem.P14 || '',
            P15: foundItem.P15 || ''
          } : null);
         // console.log(item?.conclusion);
        } catch (error) {
         // console.error("Error fetching item:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchItem();
    }
  }, [id]);

  const handleClick: MouseEventHandler<HTMLButtonElement> | undefined = ()=>{
    router.push("/list/forms/alert")
  }
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!item) {
    return <p>Item not found.</p>;
  }

 // Combine titles and paragraphs in pairs
const combinedSections = [
  { title: item.T1, paragraph: item.P1 },
  { title: item.T2, paragraph: item.P2 },
  { title: item.T3, paragraph: item.P3 },
  { title: item.T4, paragraph: item.P4 },
  { title: item.T5, paragraph: item.P5 },
  { title: item.T6, paragraph: item.P6 },
  { title: item.T7, paragraph: item.P7 },
  { title: item.T8, paragraph: item.P8 },
  { title: item.T9, paragraph: item.P9 },
  { title: item.T10, paragraph: item.P10 },
  { title: item.T11, paragraph: item.P11 },
  { title: item.T12, paragraph: item.P12 },
  { title: item.T13, paragraph: item.P13 },
  { title: item.T14, paragraph: item.P14 },
  { title: item.T15, paragraph: item.P15 },
];

return (
<div style={{ borderRadius: '15px' }} className="flex justify-center items-start min-h-screen bg-gray-100 dark:bg-gray-900 pt-10">
  <div style={{ borderRadius: '15px' }} className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg flex flex-col items-center max-w-2xl w-full mx-4">
    <h2 className="text-3xl font-semibold text-center mb-4 text-gray-900 dark:text-white">{item.titre}</h2>
    <p className="text-lg text-center mb-2 text-gray-700 dark:text-gray-300"><strong>Category:</strong> {item.category}</p>
    <p className="text-sm text-gray-500 mb-4 dark:text-gray-400"><strong>Date:</strong> {item.date}</p>
    <img 
      src={item.image} 
      alt={item.titre}  
      className="mb-4 w-[160px] h-[150px] max-w-sm max-h-96 object-contain rounded-lg mx-auto"
    />

    <p className="text mb-4 text-gray-800 dark:text-gray-200">{item.intro}</p>

    {/* Render paired titles and paragraphs, filter out empty sections */}
    {combinedSections
      .filter(section => section.title && section.paragraph)  // Only include sections with non-empty titles and paragraphs
      .map((section, index) => (
        <div key={index} className="mb-2">
          <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{section.title}</h3>
          <p className="text-gray-700 dark:text-gray-300">{section.paragraph}</p>
        </div>
      ))}

    {/* Conclusion without extra top margin */}
    <p className="text mt-2 rounded text-gray-800 "><strong>Conclusion:</strong> {item.conclusion}</p>
    <Button onClick={handleClick}>Besoin du service</Button>
  </div>
</div>



);
}

export default DetailLoiView;
