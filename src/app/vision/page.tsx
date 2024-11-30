"use client"

import Image from 'next/image';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Images
import heroImage from "/public/student.png";  // Import your hero image
import cohortImage from "/public/parent.png"; // Example image for the cohorts section
import { db } from "@/lib/firebaseSetup";
import { arrayUnion, collection, doc, addDoc, getDoc, getDocs, increment, updateDoc } from "firebase/firestore";
import DonationModal from "@/components/DialogDonation";
import { Button } from '@/components/ui/button';

export default function Home() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [role, setRole] = useState("");  // Track if the user is a Sponsor/Parrain
    const [isLoading, setIsLoading] = useState(false);
  


    const handleSubscribeWithRole = (role: string) => (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setRole(role);  // Set the role when subscribing (Sponsor or Parrain)
      setOpen(true); // Open the modal
  
      console.log(`Role: ${role}, Email: ${email}`);
    };
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      setIsLoading(true);
      // Save data to Firebase depending on the role
      try {
        if (role === "Sponsor" || role === "Parrain"||role === "Mentor"||role === "Autres") {
          // Saving the sponsor or parrain details
          await addDoc(collection(db, "ContributorsCollection"), { name, email, whatsapp, role });
        } else {
          // You can handle other types of subscriptions here
          await addDoc(collection(db, "comEmailCollection"), { email });
        }
  
        setOpen(false); // Close the modal after submission
        alert("Nous vous contacterons sous peu !");
      } catch (error) {
        console.error("Error adding document: ", error);
      }finally {
        setIsLoading(false); // Reset loading state
      }
    };
//@ts-ignore
    return (
      <div className="bg-gray-50 text-gray-900 font-sans">
        {/* Navbar */}
        <header className="bg-redpink py-4 sticky top-0 z-50 shadow-lg">
  <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
    <h1 className="text-white text-2xl font-bold">
      <a href="#">
        <div className="flex items-center">
          <img src="/img/logo.png" width={30} height={30} className="mr-2" alt="Logo" />
          Sykoti E-awareness Center
        </div>
      </a>
    </h1>

    {/* Desktop Navigation */}
    <nav
      className={`${
        isMobileMenuOpen ? 'block' : 'hidden'
      } md:flex md:space-x-8 md:block absolute  md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-redpink md:bg-transparent text-center md:text-left`}
    >
      <a href="#vision" className="block md:inline-block text-white hover:text-gray-300 py-2 md:py-0">
        Vision
      </a>
      <a href="#activities" className="block md:inline-block text-white hover:text-gray-300 py-2 md:py-0">
        Nos Activités
      </a>
      <a href="#objectifs" className="block md:inline-block text-white hover:text-gray-300 py-2 md:py-0">
        Objectifs
      </a>
      <a href="#partnerships" className="block md:inline-block text-white hover:text-gray-300 py-2 md:py-0">
        Partenariats
      </a>
    </nav>

    {/* Mobile Menu Toggle Button */}
    <div className="md:hidden">
      <button
        className="text-white text-2xl"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>
    </div>
  </div>
</header>

     

    {/* Vision Section */}
    <section id="vision" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-redpink">Notre Vision</h2>
        <p className="text-lg mt-4 text-gray-700">
          Nous croyons que le développement de l&apos;Afrique passe par la numérisation, mais qu&apos;il est essentiel de sensibiliser
          et d&apos;éduquer les individus pour une introduction sécurisée à la technologie, afin d&apos;établir une relation saine avec
          elle. Notre mission est d&apos;intégrer le bien-être humain au cœur des innovations technologiques.
        </p>
      </div>
    </section>

    {/* Team Section */}
    <section id="team" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mt-8 text-center">
            {/* Team General Image */}
            <Image
              src="/img/cybera.jpg" // Replace with the actual path to your team image
              alt="Notre équipe"
              width={800}
              height={450}
              className="rounded-lg mx-auto shadow-lg"
            />
            <p className="text-lg text-gray-700 mt-6">
              Nous sommes un groupe de jeunes passionnés, etudiants, professionnels en cybersécurité et dans des domaines technologiques connexes.
              Notre équipe est pragmatique, rigoureuse et engager pour l&apos;impact social. Nous croyons qu&apos;avec de petites actions coordonnées on peut deplacer des montagnes. 
              Nous croyons fermement qu&apos;une approche collaborative et une expertise partagée sont essentielles pour realiser un developpement durable.
            </p>
          </div>
        </div>
      </section>

    {/* Activities Section */}
    <section id="activities" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-redpink">Nos Activités</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Activity Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image src="/img/micro.jpg" alt="CyberAmbassadors" width={400} height={250} className="rounded-md" />
            <h3 className="text-xl font-semibold mt-4">Formation de CyberAmbassadeurs</h3>
            <p className="text-gray-600 mt-2">
              Nous formons des ambassadeurs numeriques, capables d&apos;influencer leurs communautés et participer a un cyberespace sûr.
            </p>
          </div>

          {/* Activity Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image src="/img/cybertrends.jpg" alt="CyberTrends" width={400} height={250} className="rounded-md" />
            <h3 className="text-xl font-semibold mt-4">Sensibilisation aux CyberTrends</h3>
            <p className="text-gray-600 mt-2">
              Nous informons le public sur les dernières tendances en matière de cybersécurité et sur les pratiques criminelles en ligne.
            </p>
          </div>

          {/* Activity Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image src="/img/dp.jpg" alt="Digital Products" width={400} height={250} className="rounded-md" />
            <h3 className="text-xl font-semibold mt-4">Développement de Produits Numériques</h3>
            <p className="text-gray-600 mt-2">
              Nous concevons des produits numériques en mettant l&apos;accent sur la sécurité et le bien-être humain.
            </p>
          </div>
        </div>
      </div>
    </section>

   {/* Objectives Section */}
   <section id="objectifs" className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-redpink">Nos Objectifs </h2>
   

    <div className="flex flex-wrap justify-center gap-8 mt-12">
      <div className="bg-pink-100 p-6 rounded-lg shadow-md w-80 sm:w-96">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Engagement civique</h3>
        <p className="text-gray-600">
         Former les individus a la sécurité en ligne,les tenir informer sur les tendances en matiere de cybercriminalité et créer un cadre propice a l&apos;engagement citoyen dans la lutte contre les cybercrimes.
        </p>
      </div>

      <div className="bg-pink-100 p-6 rounded-lg shadow-md w-80 sm:w-96">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Accompagnement des victimes</h3>
        <p className="text-gray-600">
          Soutien spécialisé pour les victimes de cybercriminalité, les aidant à surmonter les défis liés aux attaques en ligne.
        </p>
      </div>

      <div className="bg-pink-100 p-6 rounded-lg shadow-md w-80 sm:w-96">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Plaidoyer</h3>
        <p className="text-gray-600">
         Conscient du devoir citoyen de s&apos;impliquer dans la vie de l&apos;Etat nous formons, informons les individus sur le cadre reglementaire regissant le cyberespace, au plaidoyer en faveur de reglementations toujours plus adéquates et a etre d&apos;excellents citoyens connectés.
        </p>
      </div>

      <div className="bg-pink-100 p-6 rounded-lg shadow-md w-80 sm:w-96">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Outils et ressources numériques</h3>
        <p className="text-gray-600">
          Fourniture de ressources éducatives et outils pour aider les utilisateurs à sécuriser leurs activités en ligne.
        </p>
      </div>

      <div className="bg-pink-100 p-6 rounded-lg shadow-md w-80 sm:w-96">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Innovations et impact</h3>
        <p className="text-gray-600">
        Nous développons également au quotidien des solutions technologiques variées au sein de la communauté, en mettant l&apos;accent sur la sécurité, le bien-être humain, ainsi que sur l&apos;impact social.</p>
      </div>
    </div>
  </div>
</section>



    {/* Subscribe Section */}
    <section id="subscribe" className="py-20 bg-white text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Envie d&apos;en Savoir Plus ?</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
          Inscrivez-vous à notre liste de diffusion pour être informé(e) de nos activités et opportunités de participation.
        </p>
       
        <form onSubmit={handleSubscribeWithRole("subscriber")} className="max-w-lg mx-auto">
  <div className="flex items-center space-x-4">
    <Input
      type="email"
      placeholder="Votre Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full"
      required
    />
    <Button type="submit" className="bg-yellow-400 text-gray-800">
      S'inscrire
    </Button>
  </div>
</form>
      </section>

      {/* Success Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white p-6 rounded-lg max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-green-600">Merci pour votre Inscription !</h3>
          <p className="text-gray-600 mt-4">
            Vous êtes inscrit(e) à la liste &quot;Je veux en savoir plus&quot;. Vous serez informé(e) dès que la première cohorte sera lancée.
          </p>
          <Button onClick={() => setOpen(false)} className="mt-6 bg-green-600 text-white">
            Fermer
          </Button>
        </DialogContent>
      </Dialog>

       {/* Mentor/Sponsor Section */}
       <section id="partnerships" className="py-20 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Devenez Mentor / Sponsor</h2>
        <div className="flex justify-center gap-8">
          <Button onClick={() =>handleSubscribeWithRole("Sponsor")} className="bg-pink-600 text-white">Devenir Sponsor</Button>
          <Button onClick={() => handleSubscribeWithRole("Parrain")} className="bg-yellow-600 text-white">Volontaire</Button>
          <Button onClick={() => handleSubscribeWithRole("Mentor")} className="bg-pink-600 text-white">participer</Button>
          <Button onClick={() => handleSubscribeWithRole("Autres")} className="bg-yellow-600 text-white">Autre</Button>
      
        </div>
      </section>

      {/* Modal for Sponsor/Parrain Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger />
        <DialogContent className="bg-white p-6 rounded-lg max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {role === "Sponsor" ? "Devenez Sponsor" : "Devenez Parrain"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Entrez votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
              <Input
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
              <Input
                type="text"
                placeholder="Entrez votre numéro WhatsApp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full"
                required
              />
            <Button
          type="submit"
          className={`bg-pink-800 text-white w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Patientez..." : "Soumettre"}
        </Button>

            </div>
          </form>
        </DialogContent>
      </Dialog>
    {/* Footer */}
    <footer className="bg-redpink py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-white">© 2024 Sykoti E-awareness Center. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
  );
}
 