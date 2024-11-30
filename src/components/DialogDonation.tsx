"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function DonationModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Automatically open the modal when the page loads
    setOpen(true);
  }, []);

  const [copied, setCopied] = useState(false);


  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className=" flex   bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <Dialog>
        <DialogTrigger asChild>
          <button style={{ borderRadius: '15px' }} className=" bg-white text-red-500 ">
           <div    className="flex rounded"> Soutenir<img src="/img/heart.png" width={20} height={20}/> </div>
          </button>
        </DialogTrigger>
        <DialogContent 
          className="max-w-lg p-6 bg-white rounded-lg shadow-lg overflow-y-auto max-h-[90vh]"
        >
          <h1 className="text-2xl font-bold text-red-600 text-center mb-4">
            Soutenez cette Initiative 
          </h1>
          <p className="text-center text-gray-700 mb-6">
           Vous pouvez nous soutenir de divers manieres, au travers du partage d`&apos;`expertise, en devenant volontaire, sponsor (sous la section partenariats) ou encore au moyen de dons financiers. 
            Chaque contribution compte !
          </p>

          <div className="space-y-6">
            {/* Mobile Money Donation */}
            <div className="p-4 bg-pink-100 rounded-md shadow-sm">
              <h2 className="text-lg font-bold text-red-600">Mobile Money</h2>
             
              <div className="mt-2 text-lg font-mono text-red-600">
                657 273 247
              </div>
              <Button
                onClick={() => handleCopy("657273247")}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              >
                {copied ? "Copié !" : "Copier le Numéro"}
              </Button>
            </div>

            {/* Bank Transfer Donation */}
            <div className="p-4 bg-gray-100 rounded-md shadow-sm">
              <h2 className="text-lg font-bold text-gray-700">Virement Bancaire</h2>
             
              <div className="mt-2 text-lg font-mono text-gray-800">
                <p>Nom du Compte : <span className="font-bold">Catelle Ningha</span></p>
                <p>Numéro de Compte : <span className="font-bold">06009011436</span></p>
                <p>Banque : <span className="font-bold">UBA (Africa`&apos;`s global bank)</span></p>
              </div>
              <Button
                onClick={() =>
                  handleCopy(
                    "Nom du Compte: Votre Initiative, Numéro de Compte: 123456789, Banque: Banque Par Défaut"
                  )
                }
                className="mt-4 bg-gray-700 hover:bg-gray-800 text-white"
              >
                {copied ? "Détails Copiés !" : "Copier les Détails"}
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Merci pour votre soutien. Ensemble, nous pouvons créer un monde numérique plus sûr !
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
