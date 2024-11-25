import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseSetup";

interface UserData {
    uid: string;
    role: string;
    pseudo:string;
    photo:string;
    // Add other fields as necessary
}

export async function fetchCurrentUserData(uid: string): Promise<UserData | null> {
    const userQuery = query(
        collection(db, "usersCollection"),
        where("__name__", "==", uid)
    );

    const userSnapshot = await getDocs(userQuery);

    // If user found in usersCollection, return their data
    if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0]?.data() as UserData; // Type assertion
        return userData;
    }

    
    // Return null if no user is found 
    return null;
}




export async function countClients() {
    const collectionRef = collection(db, 'FakCollection');
    const snapshot = await getDocs(collectionRef);
    const count = snapshot.size;
    console.log(`Number of clients: ${count}`);

    return count;
  }
  export async function countUsers() {
    const collectionRef = collection(db, 'usersCollection');
    const snapshot = await getDocs(collectionRef);
    const count = snapshot.size;
    console.log(`Number of users: ${count}`);
    
    return count;
  }
  export async function countCampaigns() {
    const collectionRef = collection(db, 'historyCollection');
    const snapshot = await getDocs(collectionRef);
    const count = snapshot.size;
    console.log(`Number of campaigns: ${count}`);
    
    return count;
  }

