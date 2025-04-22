
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentConfirmFormData } from "@/pages/AppointmentConfirm"

interface AppointmentConfirmStartProps {
  formData: AppointmentConfirmFormData;
  onChange: (data: Partial<AppointmentConfirmFormData>) => void;
  onNext: () => void;
}

const AppointmentConfirmStart: React.FC<AppointmentConfirmStartProps> = ({
  formData,
  onChange,
  onNext,
}) => { 
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form 
    if (!formData.documentType || !formData.documentNumber) { 
      return;
    } 
    onNext();
  };

  return (
    <section className="pt-[40px] md:pt-[70px] pb-[280px] md:pb-[60px] px-5 md:px-[100px]">
      <div className="md:max-w-[486px] flex flex-col items-start gap-[42px]">
        <div className="flex flex-col gap-[12px] items-start">
          <h1 className="text-[46px] font-bold leading-[52px]">Confirma tu cita</h1>
          <p className="text-black text-[16px] max-w-lg tracking-[0.08px]">
            Revisa los detalles y confirma tu asistencia para asegurar tu cita.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-[384px]">
          <div className="mb-6">
            <Label>Tipo de documento</Label>
            <Select 
              value={formData.documentType}
              onValueChange={(value) => onChange({ documentType: value })}
            >
              <SelectTrigger id="documentType" className="h-[54px]">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                <SelectItem value="OTHER">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-[42px]">
            <Label htmlFor="documentNumber">Número de documento</Label>
            <Input
              id="documentNumber"
              value={formData.documentNumber}
              onChange={(e) => onChange({ documentNumber: e.target.value })}
              placeholder="Ingresa número de documento"
              className="focus:shadow-input"
            />
          </div>
          <Button
            type="submit"
            className="font-semibold text-[16px] leading-[20px] py-[17px] rounded-[40px] min-w-[180px] h-auto"
          >
            Confirmar
          </Button>
        </form> 
      </div>
    </section>
  );
};

export default AppointmentConfirmStart;
