
import ApiService, { Zone, ZoneOfficeInfo } from "@/api/ApiService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import React from "react";

import { useEffect, useState } from "react";

interface DepartmentSelectionProps {
  selected: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  officeId: string; 
}

const DepartmentSelection: React.FC<DepartmentSelectionProps> = ({
  selected,
  onChange,
  onNext,
  onPrev,
  officeId,
}) => {

  const { toast } = useToast();

  const [zones, setZones] = useState<Zone[]>([]);
  const [officeData, setOfficeData] = useState<ZoneOfficeInfo | null>(null);
  
  // Fetch zones office
  const fetchZones = async () => {
    try {
      const office = await ApiService.fetchOfficesZones(officeId);
      setZones(office.zones);
      setOfficeData(office);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "No se pudieron consultar las zonas de la oficina desde el servidor, pero se mantienen localmente",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    
    // Store the office data in localStorage to be used in DateSelection
    if (officeData) {
      localStorage.setItem('appointment-office-data', JSON.stringify(officeData));
    }
    
    onNext();
  };

  return (
    <section className="pt-[43px] px-5 md:px-[70px] lg:px-[204px] pb-[58px]">
      <form onSubmit={handleSubmit} className="w-full mx-auto">
        <div className="text-center text-black flex flex-col gap-3 mb-12">
          <h2 className="text-[46px] leading-[52px] font-bold">Selecciona el área de atención</h2>
          <p className="text-[16px] tracking-[0.08px]">
            Elige el servicio o departamento que necesitas visitar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-[60px] font-roboto-condensed">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`px-[24px] py-[21px] rounded-lg border hover:shadow-input hover:bg-[#F5FDF9] cursor-pointer transition-colors ${
                selected === zone.id
                  ? "border-primary-custom shadow-input bg-[#F5FDF9]"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onChange(zone.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center relative ${
                      selected === zone.id
                        ? "text-white border-primary border bg-white"
                        : "border border-gray-300"
                    }`}
                  >
                    {selected === zone.id && <div className="bg-primary h-[10px] w-[10px] rounded-[50%]"></div>}
                  </div>
                  <span className="font-medium">{zone.name}</span>
                </div>
                {selected === zone.id && <Check size={16} />}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button 
            type="button" 
            onClick={onPrev} 
            variant="outline" 
            size="formStep"
            className="text-primary border-primary text-[16px]"
          >
            Regresar
          </Button>
          <Button 
            type="submit" 
            disabled={!selected}
            size="formStep"
            className="bg-primary text-white text-[16px]"
          >
            Continuar
          </Button>
        </div>
      </form>
    </section>
  );
};

export default DepartmentSelection;
