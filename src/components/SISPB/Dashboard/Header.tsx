
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeaderProps {
  onLogout: () => void;
  userName?: string;
  lastAccess?: string;
}

export default function Header({ 
  onLogout, 
  userName = "EMANUEL DE MORAES NERES", 
  lastAccess = "hoje às 08:35" 
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Update time every second
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time: HH:MM:SS
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      setCurrentTime(time);
      
      // Format date: DD/MM/YYYY
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      const date = `${day}/${month}/${year}`;
      setCurrentDate(date);
      
      // Set greeting based on time of day
      const hour = now.getHours();
      let greetingText = "";
      if (hour >= 5 && hour < 12) {
        greetingText = "Bom dia";
      } else if (hour >= 12 && hour < 18) {
        greetingText = "Boa tarde";
      } else {
        greetingText = "Boa noite";
      }
      setGreeting(greetingText);
    };
    
    // Initial update
    updateDateTime();
    
    // Set interval to update every minute
    const intervalId = setInterval(updateDateTime, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white shadow p-4 flex flex-col sm:flex-row justify-between items-center rounded-md mb-6">
      <div className="mb-3 sm:mb-0 text-center sm:text-left">
        <p className="text-lg font-semibold text-[#00c6a7]">{greeting}, <strong>{userName}</strong></p>
        <div className="flex flex-col sm:flex-row sm:space-x-4 text-xs text-gray-500">
          <p>{currentDate} - {currentTime}</p>
          <p>Último acesso: {lastAccess}</p>
        </div>
      </div>
      <Button 
        variant="destructive" 
        onClick={onLogout}
        className="bg-[#00c6a7] hover:bg-[#00a689]"
      >
        Sair
      </Button>
    </div>
  );
}
