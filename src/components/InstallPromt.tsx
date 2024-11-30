"use client"
import { useEffect, useState } from 'react';
import { useBeforeInstallPrompt } from './BeforeInstall';
import { Button } from './ui/button';


interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  }
  


  
  const InstallButton = () => {
    const deferredPrompt = useBeforeInstallPrompt();
    const [isInstallVisible, setInstallVisible] = useState(false);
  
    const handleInstall = async () => {
      if (!deferredPrompt) return;
  
      deferredPrompt.prompt(); // Show the install prompt
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setInstallVisible(false); // Hide button after user action
    };
  
    // Show button only if prompt is available
    useEffect(() => {
      if (deferredPrompt) setInstallVisible(true);
    }, [deferredPrompt]);
  
    return (
      isInstallVisible && (
        <Button
          id="installButton"
          onClick={handleInstall}
          className="fixed bottom-6 right-6  text-white w-14 h-14 hover:bg-gray-500 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-500  z-50"
   >
          App
        </Button>
      )
    );
  };
  
  export default InstallButton;
  