"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebaseSetup";

// Define the Section type
interface Section {
  title: string;
  content: string;
  image?: string; // image is optional
}

// Define the Message type
interface Message {
  id: string;
  timestamp: {
    toDate: () => Date;
  };
  sections: Section[];
}

const MessageDetail = () => {
  const { messageId } = useParams<{ messageId: string }>(); // Ensure messageId is of type string
  const [message, setMessage] = useState<Message | null>(null); // Set state to accept Message or null
  const [error, setError] = useState<string | null>(null); // Handle error state as string or null

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const messageRef = doc(db, "MessageCollection", messageId);
        const messageDoc = await getDoc(messageRef);
  
        if (messageDoc.exists()) {
          console.log("Retrieved Document Data:", messageDoc.data()); // Debugging
          
          setMessage({ id: messageDoc.id, ...messageDoc.data() } as Message);
        } else {
          console.log("No such document!");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log("Error fetching message:", err);
          setError(err.message);
        } else {
          console.log("An unknown error occurred");
          setError("An unknown error occurred");
        }
      }
    };
  
    fetchMessage();
  }, [messageId]);
  

  if (error) return <div className="text-red-500">Erreur: {error}</div>;
  if (!message) return <div className="text-gray-500">Chargement...</div>;

  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-6">
    <div className="bg-white dark:bg-gray-800 border border-0 w-full max-w-2xl shadow-lg rounded-lg p-6 space-y-6">
    <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
      Hey, vous nous avez envoyé une demande d'aide récemment !
    </h2>
  
    {/* Date */}
    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
      <strong className="font-medium text-gray-800 dark:text-white">Date:</strong>{" "}
      {message.timestamp.toDate().toLocaleString()}
    </p>
  
    {/* Sections */}
    <div className="space-y-6">
      {message.sections && message.sections.length > 0 ? (
        message.sections.map((section, index) => (
          <div key={index} className="pb-4">
            {/* Section Title */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {section.title}
            </h3>
  
            {/* Section Content */}
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              {section.content}
            </p>
  
            {/* Section Image */}
            {section.image && (
              <div className="mb-4">
                <img
                  src={section.image}
                  alt={`Image for ${section.title}`}
                  className="max-w-full rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-lg text-gray-500 dark:text-gray-400">Aucune section disponible.</p>
      )}
    </div>
  </div>
  </div>

  
  );
};

export default MessageDetail;
