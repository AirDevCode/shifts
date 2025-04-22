
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import React, {useState} from "react";

interface TimeSelectionProps {
  selected: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onConfirm: () => void;
  onPrev: () => void;
}



const TimeSelection: React.FC<TimeSelectionProps> = ({
  selected,
  onChange,
  onNext,
  onConfirm,
  onPrev,
}) => {
  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();
    if (!selected) return;
    onConfirm();
  };

  return (
    <section className="pt-[43px] px-5 md:px-[70px] lg:px-[204px] pb-[58px]">
      <form onSubmit={handleSubmit} className="w-full mx-auto">
        <div className="text-center text-black flex flex-col gap-3 mb-12">
          <h2 className="text-[46px] leading-[52px] font-bold">Selecciona la hora de tu cita</h2>
          <p className="text-[16px] tracking-[0.08px]">
            Elige el horario que mejor se adapte a tu agenda.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[23px] mb-[60px]">
          {timeSlots.map((time) => (
            <div
              key={time}
              className={`px-[26px] pt-[11px] pb-[37px] rounded-lg relative border cursor-pointer transition-colors text-center ${
                selected === time
                  ? "border-primary shadow-input bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50 hover:shadow-input hover:bg-primary/10 hover:text-primary"
              }`}
              onClick={() => onChange(time)}
            >
              <div className="flex gap-[6px] items-center justify-center h-full">
                <span className="font-medium text-[32px] font-roboto-condensed">{time.split(' ')[0]}</span>
                <span className="text-[14px]">{time.split(' ')[1]}</span>
                {selected === time && (
                  <Check size={20} className="text-primary-custom absolute bottom-0 mb-[10px]" />
                )}
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
            disabled={!selected || isSubmitting}
            size="formStep"
            className="bg-primary text-white text-[16px]"
          >
            Agendar cita
          </Button>
        </div>
      </form>
    </section>
  );
};

export default TimeSelection;
