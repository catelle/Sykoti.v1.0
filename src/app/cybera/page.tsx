"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Images
import heroImage from "/public/student.png";  // Import your hero image
import cohortImage from "/public/parent.png"; // Example image for the cohorts section
import { db } from "@/lib/firebaseSetup";
import { arrayUnion, collection, doc, addDoc, getDoc, getDocs, increment, updateDoc } from "firebase/firestore";
import DonationModal from "@/components/DialogDonation";

export default function CyberAmbassadorPage() {
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

  return (
    <div className="bg-gray-50 text-gray-900 font-sans">

<header className="bg-redpink py-4 sticky top-0 z-50 shadow-lg">
  <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
    <h1 className="text-white text-2xl font-bold">
      <a href="#">
        <div className="flex items-center">
          <img src="/img/logo.png" width={40} height={40} className="mr-2" alt="Logo" />
          CyberAmbassador
        </div>
      </a>
    </h1>

    {/* Desktop Navigation */}
    <nav
      className={`${
        isMobileMenuOpen ? 'block' : 'hidden'
      } md:flex md:space-x-8 md:block absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-redpink md:bg-transparent text-center md:text-left`}
    >
      <a href="#vision" className="block md:inline-block text-white hover:text-gray-300 py-2 md:py-0">
      À propos
      </a>
      <a href="#cohorts" className="block md:inline-block text-white hover:text-gray-300 py-2 md:py-0">
      Cohortes
      </a>
      <a href="#target" className="block md:inline-block text-white hover:text-gray-300 py-2 md:py-0">
      S&apos;inscrire
      </a>
      <a href="#partnerships" className="block md:inline-block text-white hover:text-gray-300 py-2 md:py-0">
      Devenir Mentor
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
      <section
  id="vision"
  className="relative mt-8 text-white py-24"
>
  {/* Background Layer */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url('/img/cybera.jpg')`, opacity: 0.1 }}
    aria-hidden="true"
  ></div>

  {/* Text Content */}
  <div className="relative z-10 text-center mt-8">
    <h2 className="text-4xl text-pink-900 font-bold mb-4">
      Devenez un CyberAmbassadeur
    </h2>
    <p className="text-xl max-w-3xl text-gray-900 mx-auto mb-8">
      Engagez-vous pour la cybersécurité et devenez un acteur clé dans la
      protection contre la criminalité en ligne. Formation interactive,
      ludique sur une plateforme dédiée de 5 semaines.
    </p>
  </div>
</section>


      {/* About Section */}
      <section id="about" className="py-20 bg-white text-center">
        {/* <h2 className="text-3xl font-semibold text-pink-900 mb-8">Pourquoi Devenir CyberAmbassadeur ?</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
          Devenir un CyberAmbassadeur, c’est acquérir des connaissances essentielles en cybersécurité adaptées à votre domaine professionnel, sans avoir besoin de compétences techniques avancées. 
        </p> */}
        <div className="flex justify-center gap-8 mt-12">
          <div className="bg-pink-100 p-6 rounded-lg shadow-md w-80">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Formation interactive</h3>
            <p className="text-gray-600">Modules de formation interactifs pour une expérience d&apos;apprentissage optimale.</p>
          </div>
          <div className="bg-pink-100 p-6 rounded-lg shadow-md w-80">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Badge</h3>
            <p className="text-gray-600">À la fin de la formation, vous recevrez un badge CyberAmbassador pour temoigner de votre engagement en cybersécurité.</p>
          </div>
        </div>
      </section>

     {/* Cohorts Section */}
<section id="cohorts" className="py-20 bg-gray-50 text-center">
  <h2 className="text-3xl font-semibold text-pink-900 mb-8">Nos Cohortes</h2>
  <div className="flex flex-wrap justify-center gap-8">
    <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-80 md:w-80">
      <img src="/img/guard.jpg" alt="Cohorte 1" className="h-40 w-full object-cover rounded-md mb-4" />
      <h3 className="text-xl font-semibold text-red-600 mb-4">Cohorte 1 : Guardians</h3>
      <p className="text-gray-600 mb-4">Développer des compétences de base et intermédiaires en protection des données, lutte contre les cyberattaques et prévention des cybercrimes.</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-80 md:w-80">
      <img src="/img/7200955_30758.jpg" alt="Cohorte 2" className="h-40 w-full object-cover rounded-md mb-4" />
      <h3 className="text-xl font-semibold text-red-600 mb-4">Cohorte 2 : CyberPartners</h3>
      <p className="text-gray-600 mb-4">Devenez un acteur clé dans la mise en place de bonnes pratiques de cybersécurité au sein de votre organisation.</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-80 md:w-80">
      <img src="/img/micro.jpg" alt="Cohorte 3" className="h-40 w-full object-cover rounded-md mb-4" />
      <h3 className="text-xl font-semibold text-red-600 mb-4">Cohorte 3 : Advocates</h3>
      <p className="text-gray-600 mb-4">Soutenez résilience numérique en afrique à travers le plaidoyer pour un meilleur cadre reglemantaire et impliquer vous dans des initiatives autour de cette thématique.</p>
    </div>
  </div>
</section>


      {/* Subscribe Section */}
      <section id="target" className="py-20 bg-white text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Envie d&apos;en Savoir Plus ?</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
          Inscrivez-vous à notre liste de diffusion pour être informé(e) du lancement de la première cohorte et recevoir des mises à jour sur le programme.
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
        <DialogContent className="bg-white ml-4 mr-4 p-6 rounded-lg max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-green-600">Merci pour votre Inscription !</h3>
          <p className="text-gray-600 mt-4">
            Vous êtes inscrit(e) à la liste &quot;Je veux en savoir plus &quot;. Vous serez informé(e) dès que la première cohorte sera lancée.
          </p>
          <Button onClick={() => setOpen(false)} className="mt-6 bg-green-600 text-white">
            Fermer
          </Button>
        </DialogContent>
      </Dialog>

       {/* Mentor/Sponsor Section */}
<section id="partnerships" className="py-20 bg-gray-100 ml-4 mr-4 text-center">
  <h2 className="text-3xl font-semibold text-gray-800 mb-8">Devenez Mentor / Sponsor</h2>
  <div className="flex flex-wrap justify-center gap-8">
    <Button onClick={() => handleSubscribeWithRole("Sponsor")} className="bg-pink-600 text-white w-full sm:w-auto">
      Devenir Sponsor
    </Button>
    <Button onClick={() => handleSubscribeWithRole("Parrain")} className="bg-yellow-600 text-white w-full sm:w-auto">
      Devenir Parrain/Marraine
    </Button>
    <Button onClick={() => handleSubscribeWithRole ("Mentor")} className="bg-pink-600 text-white w-full sm:w-auto">
      Devenir Mentor
    </Button>
    <Button onClick={() => handleSubscribeWithRole ("Autres")} className="bg-yellow-600 text-white w-full sm:w-auto">
      Autre
    </Button>
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
  
      <footer className="bg-pink-900 text-white py-6 text-center">
        <p>&copy; 2024 CyberAmbassador. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
