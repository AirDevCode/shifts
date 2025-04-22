import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TurnModal from "@/components/turn/TurnModal";
import { useTheme } from "@/contexts/ThemeContext";

const Turnero = () => {
  const { theme } = useTheme();

  const [currentTurn, setCurrentTurn] = useState(null);
  const [lastCalls, setLastCalls] = useState([]);
  const [isNewCall, setIsNewCall] = useState(false);

   const logoUrl = useTheme().theme.logoUrl;
   let deviceId = localStorage.getItem("device_id");
   
   let clientsQueue : any [] = [];

  useEffect(() => {
    const eventSource = new EventSource(`https://app-turnos-realtime-api-develop.onrender.com/v1.0/stream/${deviceId}`);


    eventSource.onmessage = (event) => {
      if (event.data) {
        let data = JSON.parse(event.data);
        
        clientsQueue.push(data);

          setLastCalls(clientsQueue);
          setCurrentTurn(data);
          setIsNewCall(true);
          setTimeout(() => setIsNewCall(false), 4000);
        
      }
    };

    return () => eventSource.close();
  }, []);


  return (
    <main className="min-h-screen py-[84px] flex bg-[#FCFAF9]">
      <div className="max-w-7xl w-full mx-auto py-[59px] px-[74px] shadow-box-shadow rounded-[12px] relative bg-[#fff]">
        <div className="lg:col-span-12">
          <img src={logoUrl} className="absolute -top-10 w-[80px] md:w-[100px] lg:w-[136px]" alt="Logo" />
          <h1 className="text-[20px] md:text-[24px] lg:text-[36px] text-[#333E33] font-bold mb-[75px] md:ms-[120px] lg:ms-[190px]">
            Por favor, espera tu turno y acércate cuando seas llamado.
          </h1>
          <div className="bg-white rounded-xl overflow-hidden flex flex-col gap-[30px]">
            <div className="p-4 bg-gradient-to-bl from-[#F2EFED] via-[#FFF] to-[#E4DDD9] border border-[#EFECEC] rounded-[12px]">
              <div className="grid grid-cols-5 text-[18px] text-black font-normal leading-[21px] tracking-[-0.16px]">
                <div>Turno</div>
                <div>Cliente</div>
                <div>Estado</div> 
                <div>Asesor</div> 
                <div>Estación</div> 
              </div>
            </div>
            {lastCalls.length > 0 &&  
            <div className="flex flex-col gap-[16px] text-black">
              <AnimatePresence initial={false}>
                {lastCalls.map((call, index) => (
                  <motion.div
                    key={`${call.code}-${call.timestamp}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 grid grid-cols-5 items-center bg-[#FBFEFF] turn border rounded-[12px] text-[24px]
                      ${call.status === "Llamado" ? "turn__waiting" : ""}`}
                  >
                    <div>{call.code}</div>
                    <div>{call.customer}</div>
                    <div>{call.status}</div>
                    <div>{call.advisor}</div>
                    <div>{call.counter}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            }
          </div>
        </div>
      </div>
      {lastCalls.length > 0 &&  
        <TurnModal isOpen={isNewCall} onClose={() => setIsNewCall(false)} turn={currentTurn} />
      }
    </main>
  );
};

export default Turnero;