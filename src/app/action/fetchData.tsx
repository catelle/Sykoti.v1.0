import { db } from "@/lib/firebaseSetup";
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, increment, updateDoc } from "firebase/firestore";
import { User } from "lucide-react";
import { Dangrek } from "next/font/google";
import { date } from "zod";


export const incrementLike = async (itemId: string, userId: string) => {
  try {
    // Reference to the specific document in the collection
    const itemRef = doc(db, "historyCollection", itemId);

    // Update the document with the new userId and increment the like count
    await updateDoc(itemRef, {
      likes: arrayUnion(userId), // Add userId to the votes array
      likeCount: increment(1),  // Increment the likes count by 1
    });

    console.log("Like incremented successfully");
  } catch (error) {
    console.error("Error incrementing like:", error);
  }
};

export const incrementVote = async (itemId: string, userId: string) => {
  try {
    const itemRef = doc(db, "historyCollection", itemId);

      await updateDoc(itemRef, {
        votes: arrayUnion(userId), // Add userId to the votes array
        voteCount: increment(1),  // Increment the likes count by 1
      });
  
      console.log("vote incremented successfully");
    } catch (error) {
      console.error("Error incrementing vote:", error);
    }
};

export const saveToContributors = async (data: any) => {
  try {
    await addDoc(collection(db, "ContributorsCollection"), data);
    console.log("Contributor saved!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const saveToComEmail = async (email: any) => {
  try {
    await addDoc(collection(db, "comEmailCollection"), { email });
    console.log("Email saved!");
  } catch (e) {
    console.error("Error adding email: ", e);
  }
};
export const fetchNewsItems = async () => {
  try {
    // Reference the 'history' collection
    const newsCollectionRef = collection(db, "NewsCollection");

    // Fetch the documents from the collection
    const newsSnapshot = await getDocs(newsCollectionRef);

    
  // Map through the documents and extract the relevant fields
  const newsItems = newsSnapshot.docs.map(doc => ({
      id: doc.id, // Use the document ID
      image: doc.data().image, // Extract imageuri
      title: doc.data().title, // Extract title
      description:doc.data().description,
      link:doc.data().link,
      date:doc.data().date,
      pays:doc.data().country,
      readByUsers: doc.data().readByUsers,
      

    }));

    return newsItems; // Return the array of history items
  } catch (error) {
    console.error("Error fetching history items: ", error);
    return []; // Return an empty array in case of error
  }
};



const fetchHistoryItems = async () => {
    try {
      // Reference the 'history' collection
      const historyCollectionRef = collection(db, "historyCollection");
  
      // Fetch the documents from the collection
      const historySnapshot = await getDocs(historyCollectionRef);
  
      
    // Map through the documents and extract the relevant fields
    const historyItems = historySnapshot.docs.map(doc => ({
        id: doc.id, // Use the document ID
        image: doc.data().imageuri, // Extract imageuri
        title: doc.data().title, // Extract title
        autor: doc.data().Autor,
        date: doc.data().Date,
        conclusion:doc.data().conclusion,
        country:doc.data().country,
        platform:doc.data().platform,
        storyCat: doc.data().storyCat,
        email:doc.data().email,
        developpement:doc.data().developpement,
        introduction:doc.data().introduction,
        likecount:doc.data().likeCount,
        votecount:doc.data().voteCount,
        likes:doc.data().likes,
        votes:doc.data().votes
        

      }));
  
      return historyItems; // Return the array of history items
    } catch (error) {
      console.error("Error fetching history items: ", error);
      return []; // Return an empty array in case of error
    }
  };
  
  export default fetchHistoryItems; 

  export const fetchAstuceItems = async () => {
    try {
      // Reference the 'history' collection
      const fakCollectionRef = collection(db, "FakCollection");
  
      // Fetch the documents from the collection
      const fakSnapshot = await getDocs(fakCollectionRef);
  
      
    // Map through the documents and extract the relevant fields
    const fakItems = fakSnapshot.docs.map(doc => ({
        id: doc.id, // Use the document ID
        image: doc.data().image, // Extract imageuri
        titre: doc.data().titre, // Extract title
        category: doc.data().categorie, 
        intro:doc.data().intro,
        date:doc.data().createdAt,
        conclusion:doc.data().conclusion,
        t1:doc.data().T1,
        t2:doc.data().T2,
        t3:doc.data().T3,
        t4:doc.data().T4,
        t5:doc.data().T5,
        t6:doc.data().T6,
        t7:doc.data().T7,
        t8:doc.data().T8,
        t9:doc.data().T9,
        t10:doc.data().T10,
        t11:doc.data().T11,
        t12:doc.data().T12,
        t13:doc.data().T13,
        t14:doc.data().T14,
        t15:doc.data().T15,
        P1:doc.data().p1,
        P2:doc.data().p2,
        P3:doc.data().p3,
        P4:doc.data().p4,
        P5:doc.data().p5,
        P6:doc.data().p6,
        P7:doc.data().p7,
        P8:doc.data().p8,
        P9:doc.data().p9,
        P10:doc.data().p10,
        P11:doc.data().p11,
        P12:doc.data().p12,
        P13:doc.data().p13,
        P14:doc.data().p14,
        P15:doc.data().p15,



      
      }));
  
      return fakItems; // Return the array of history items
    } catch (error) {
      console.error("Error fetching history items: ", error);
      return []; // Return an empty array in case of error
    }
  };
  

  export const fetchLoisItems = async () => {
    try {
      // Reference the 'history' collection
      const loiCollectionRef = collection(db, "LoisCollection");
  
      // Fetch the documents from the collection
      const loiSnapshot = await getDocs(loiCollectionRef);
  
      
    // Map through the documents and extract the relevant fields
    const loiItems = loiSnapshot.docs.map(doc => ({
        id: doc.id, // Use the document ID
        image: doc.data().image, // Extract imageuri
        title: doc.data().title, // Extract title
        country: doc.data().country, // Extract title
        link:doc.data().link,
        content:doc.data().content,
        description:doc.data().description
  
      
      }));
  
      return loiItems; // Return the array of history items
    } catch (error) {
      console.error("Error fetching history items: ", error);
      return []; // Return an empty array in case of error
    }
  };
  

  export const fetchScamsItems = async () => {
    try {
      // Reference the 'history' collection
      const scamCollectionRef = collection(db, "ScamCollection");
  
      // Fetch the documents from the collection
      const scamSnapshot = await getDocs(scamCollectionRef);
  
      
    // Map through the documents and extract the relevant fields
    const scamItems = scamSnapshot.docs.map(doc => ({
        id: doc.id, // Use the document ID
        image: doc.data().image, // Extract imageuri
        description: doc.data().description, // Extract title
        status: doc.data().status, // Extract title
        category:doc.data().category,
        platform:doc.data().platform,
        date:doc.data().date,
        content: doc.data().content,
        link: doc.data().link,
        evidence: doc.data().evidence,
      
      }));
  
      return scamItems; // Return the array of history items
    } catch (error) {
      console.error("Error fetching history items: ", error);
      return []; // Return an empty array in case of error
    }
  };
  

  // export const fetchTemoignageItems = async () => {
  //   try {
  //     // Reference the 'history' collection
  //     const temCollectionRef = collection(db, "historyCollection");
  
  //     // Fetch the documents from the collection
  //     const temSnapshot = await getDocs(temCollectionRef);
  
      
  //   // Map through the documents and extract the relevant fields
  //   const temItems = temSnapshot.docs.map(doc => ({
  //       id: doc.id, // Use the document ID
  //       image: doc.data().imageuri, // Extract imageuri
  //       title: doc.data().title, // Extract title
  //       storyCat: doc.data().storyCat, // Extract title
  //       country:doc.data().country,
  //       platform:doc.data().platform,
  //       date:doc.data().Date,
  //       autor:doc.data().Autor,
  //       conclusion:doc.data().conclusion,
  //       developpment:doc.data().developpment,
  //       email:doc.data().email,
  //       introduction:doc.data().introduction,
  //       likes:doc.data().likes,
  //       votes:doc.data().votes,
  //       likesCount: doc.data().likeCount,
  //       votesCount: doc.data().voteCount,
        
      
  //     }));
  //     console.log(temItems);
  
  //     return temItems; // Return the array of history items
  //   } catch (error) {
  //     console.error("Error fetching history items: ", error);
  //     return []; // Return an empty array in case of error
  //   }
  // };


  export const fetchTemoignageItemById = async (id: string) => {
    try {
      // Reference the document by its ID in the 'historyCollection' collection
      const temDocRef = doc(db, "historyCollection", id);
  
      // Fetch the document
      const temDoc = await getDoc(temDocRef);
  
      // Check if the document exists
      if (temDoc.exists()) {
        // Extract and return relevant fields
        return {
         

          id: temDoc.id,
          image: temDoc.data().imageuri,
          title: temDoc.data().title,
          date: temDoc.data().Date,
          autor: temDoc.data().Autor,
          conclusion: temDoc.data().conclusion,
          storyCat: temDoc.data().storyCat,
          country: temDoc.data().country,
          platform: temDoc.data().platform,
          developpement: temDoc.data().developpement,
          email: temDoc.data().email,
          introduction: temDoc.data().introduction,
          likecount: temDoc.data().likeCount,
          votecount: temDoc.data().voteCount,
          likes: temDoc.data().likes,
          votes: temDoc.data().votes,


        };
      } else {
        console.error("No such document!");
        return null; // Return null if the document doesn't exist
      }
    } catch (error) {
      console.error("Error fetching temoignage item by ID:", error);
      return null; // Return null in case of error
    }
  };

  
  export const fetchUrgencesItems = async () => {
    try {
      // Reference the 'history' collection
      const urgCollectionRef = collection(db, "UrgenceCollection");
  
      // Fetch the documents from the collection
      const urgSnapshot = await getDocs(urgCollectionRef);
  
      
    // Map through the documents and extract the relevant fields
    const urgItems = urgSnapshot.docs.map(doc => ({
        id: doc.id, // Use the document ID
        image: doc.data().image, // Extract imageuri
        message: doc.data().message, // Extract title
        moyen_contact:doc.data().moyen_contact,
        addinfo:doc.data().addinfo,
        categorie:doc.data().categorie,
        date:doc.data().date,
        description:doc.data().description,
        name:doc.data().name,
        pays:doc.data().pays,
        platform:doc.data().platform,
        solution:doc.data().solution,
        status:doc.data().status,
        userid:doc.data().userid,
        
      
      }));
  
      return urgItems; // Return the array of history items
    } catch (error) {
      console.error("Error fetching history items: ", error);
      return []; // Return an empty array in case of error
    }
  };
  
  