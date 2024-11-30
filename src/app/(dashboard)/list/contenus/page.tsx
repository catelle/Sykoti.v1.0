"use client"
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { db } from "@/lib/firebaseSetup";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DrawerDialog from "@/components/DrawerDialog";
import { useRouter } from "next/navigation";

interface Sequence {
  anime: string;
  title: string;
  audio: string;
  message:string;
  response1: string;
  response2: string;
  response3: string;
  conclusion: string;
}

const contentTypes = ["Type 1", "Type 2", "Type 3"];

const AddContent: React.FC = () => {
  const [numberOfSequences, setNumberOfSequences] = useState<number>(1);
  const [sequences, setSequences] = useState<Sequence[]>([
    { anime: "", title: "", audio: "", message:"", response1: "", response2: "", response3: "", conclusion: "" },
  ]);
  const [animeFiles, setAnimeFiles] = useState<(File | null)[]>([]);
  const [audioFiles, setAudioFiles] = useState<(File | null)[]>([]);
  const [contentType, setContentType] = useState<string>("");
  const [globalTitle, setGlobalTitle] = useState<string>(""); // State for global title
  const [globalDescription, setGlobalDescription] = useState<string>(""); // State for global description
  const [contents, setContents] = useState<{ title: string; type: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
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




  const fetchContents = async () => {
    const contentCollection = await getDocs(collection(db, 'contentCollection'));
    const contentList = contentCollection.docs.map(doc => {
      const data = doc.data();
      return { title: data.sequences[0].title, type: data.type };
    });
    setContents(contentList);
  };

  const handleSequenceChange = (index: number, field: keyof Sequence, value: string) => {
    const newSequences = [...sequences];
    newSequences[index][field] = value;
    setSequences(newSequences);
  };

  const handleNumberOfSequencesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    setNumberOfSequences(num);
    setSequences(Array.from({ length: num }, () => ({
      anime: "",
      title: "",
      audio: "",
      message:"",
      response1: "",
      response2: "",
      response3: "",
      conclusion: ""
    })));
    setAnimeFiles(Array(num).fill(null));
    setAudioFiles(Array(num).fill(null));
  };

  const handleFileChange = (index: number, field: 'anime' | 'audio', file: File | null) => {
    if (field === 'anime') {
      const newFiles = [...animeFiles];
      newFiles[index] = file;
      setAnimeFiles(newFiles);
    } else {
      const newFiles = [...audioFiles];
      newFiles[index] = file;
      setAudioFiles(newFiles);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const uploadedSequences = await Promise.all(sequences.map(async (sequence, index) => {
        const animeURL = animeFiles[index] ? await uploadFile(animeFiles[index]!) : "";
        const audioURL = audioFiles[index] ? await uploadFile(audioFiles[index]!) : "";
        return {
          ...sequence,
          anime: animeURL,
          audio: audioURL,
        };
      }));

      // Save content with uploaded URLs, global title, and description to Firestore
      await addDoc(collection(db, "contents"), {
        type: contentType,
        globalTitle: globalTitle, // Add global title
        globalDescription: globalDescription, // Add global description
        sequences: uploadedSequences
      });

      alert("Content added successfully!");
      setSequences([{ anime: "", title: "", audio: "", message:"", response1: "", response2: "", response3: "", conclusion: "" }]);
      setAnimeFiles([]);
      setAudioFiles([]);
      setNumberOfSequences(1);
      setContentType("");
      setGlobalTitle(""); // Reset global title
      setGlobalDescription(""); // Reset global description
    } catch (error) {
      console.error("Error adding content: ", error);
      alert("Failed to add content. Please try again.");
    }
  };

  const handleSeeContent = () => {
    fetchContents();
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Add New Content</h1>
      <button type="button" onClick={handleSeeContent}>
          See Content
      </button>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
       
       
        {/* Global Description */}
        <div>
          <label htmlFor="globalDescription">Global Description:</label>
          <textarea
            id="globalDescription"
            value={globalDescription}
            onChange={(e) => setGlobalDescription(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        {/* Select Content Type */}
        <div>
          <label htmlFor="contentType">Content Type:</label>
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Content Type</option>
            {contentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Number of Sequences */}
        <div>
          <label htmlFor="numberOfSequences">Number of Sequences:</label>
          <input
            type="number"
            id="numberOfSequences"
            value={numberOfSequences}
            onChange={handleNumberOfSequencesChange}
            min="1"
            className="border p-2"
          />
        </div>

        {/* Sequences Input Fields */}
        {sequences.map((sequence, index) => (
          <div key={index} className="border p-4 rounded-md">
            <h2 className="font-semibold">Sequence {index + 1}</h2>
            <div>
              <label htmlFor={`response1-${index}`}>Message a l`&apos;`utilisateur:</label>
              <input
                type="text"
                id={'message'}
                value={sequence.message}
                onChange={(e) => handleSequenceChange(index, "message", e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor={`anime-${index}`}>Anime JSON File:</label>
              <input
                type="file"
                id={`anime-${index}`}
                accept=".json"
                onChange={(e) => handleFileChange(index, 'anime', e.target.files ? e.target.files[0] : null)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor={`title-${index}`}>Title:</label>
              <input
                type="text"
                id={`title-${index}`}
                value={sequence.title}
                onChange={(e) => handleSequenceChange(index, "title", e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor={`audio-${index}`}>Audio File:</label>
              <input
                type="file"
                id={`audio-${index}`}
                accept="audio/*"
                onChange={(e) => handleFileChange(index, 'audio', e.target.files ? e.target.files[0] : null)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor={`response1-${index}`}>Response 1:</label>
              <input
                type="text"
                id={`response1-${index}`}
                value={sequence.response1}
                onChange={(e) => handleSequenceChange(index, "response1", e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor={`response2-${index}`}>Response 2:</label>
              <input
                type="text"
                id={`response2-${index}`}
                value={sequence.response2}
                onChange={(e) => handleSequenceChange(index, "response2", e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor={`response3-${index}`}>Response 3:</label>
              <input
                type="text"
                id={`response3-${index}`}
                value={sequence.response3}
                onChange={(e) => handleSequenceChange(index, "response3", e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor={`conclusion-${index}`}>Conclusion:</label>
              <input
                type="text"
                id={`conclusion-${index}`}
                value={sequence.conclusion}
                onChange={(e) => handleSequenceChange(index, "conclusion", e.target.value)}
                className="border p-2 w-full"
              />
            </div>
          </div>
        ))}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Content</button>
      </form>

         {/* Modal for displaying contents */}
         <DrawerDialog
        open={modalVisible}
        setOpen={handleCloseModal}
        title="Uploaded Contents"
        description=""
        triggerButton={null}
        footerButtonForMobile={<button onClick={handleCloseModal}>Close</button>}
        classNameContent="h-[95%]"
      >
        <ul>
          {contents.map((content, index) => (
            <li key={index}>
              {content.title} - {content.type}
            </li>
          ))}
        </ul>
      </DrawerDialog>
    </div>
  );
};

export default AddContent;
