import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export default function HomeSection1() {
  return (
    <div className="bg-white/60 md:p-16 p-4 rounded-xl gap-32 flex flex-col">
      <div className="flex flex-col gap-8 xl:flex-row justify-between">
        <div className="gap-8 flex flex-col xl:w-1/2 w-full">
          <div className="flex flex-col gap-2 font-semibold">
            <span className="text-secondary-500 text-sm font-inter">
              Icarus ERP - Transformando a Gestão da Piscicultura
            </span>
            <span className="text-[42px] leading-[45px] font-medium">
              SIMPILIFIQUE SUA OPERAÇÃO E{" "}
              <span className="font-semibold text-primary-500">
                MAXIMIZE SEUS RESULTADOS
              </span>{" "}
              COM TECNOLOGIA INOVADORA.
            </span>
            <div className="text-secondary-500 gap-2 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary-500/20 flex rounded-full">
                  <Check />
                </div>
                <span>Gestão Completa e Integrada.</span>
              </div>
              <div className="flex items-center gap-2 text-accent-500">
                <div className="p-2 bg-accent-500/25 flex rounded-full">
                  <Check />
                </div>
                <span>Monitoramento em Tempo Real.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary-500/20 flex rounded-full">
                  <Check />
                </div>
                <span>Redução de Custos Operacionais.</span>
              </div>
              <div className="flex items-center gap-2 text-accent-500">
                <div className="p-2 bg-accent-500/25 flex rounded-full">
                  <Check />
                </div>
                <span>Conformidade e Rastreabilidade.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary-500/20 flex rounded-full">
                  <Check />
                </div>
                <span>Acessível de Qualquer Lugar.</span>
              </div>
            </div>
          </div>
          <div>
            <Button className="rounded-full bg-primary-500 hover:bg-primary-500/80 gap-2 font-bold text-text">
              <span>Testar Sistema</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center min-w-[280px]">
          <div className="bg-secondary-500/10 rounded-xl w-[280px] h-[400px]"></div>
        </div>
      </div>
      <div className="flex flex-col gap-16 ">
        <div className="flex flex-col text-center gap-2 font-semibold">
          <span className="text-secondary-500 text-sm">
            Tempo é precioso. Comece na frente com a Icarus
          </span>
          <span className="text-[42px] leading-[45px] ">
            Tudo pronto em <span className="text-primary-500">5 Minutos</span>
          </span>
          <span className="text-neutrals-500/75 text-sm">
            Para iniciar no ERP perfeita para Sua Piscicultura
          </span>
        </div>
        <div className=" rounded-xl w-full overflow-hidden bg-primary-500/10">
          <video className="w-full " autoPlay loop muted>
            <source src="/video/denovosaporra.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
