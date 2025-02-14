import { Button } from "@/components/ui/button";

export default function HomeSection6() {
  return (
    <div className='flex md:p-16 p-8 flex-col items-start gap-2 self-stretch rounded-[16px] bg-primary-500'>
      <div className='flex flex-col items-start gap-8 '>
        <div className='flex flex-col items-start gap-2 md:w-1/2'>
          <span className='text-white text-[14px] font-bold'>Identificação de Problemas Recorrentes</span>
          <span className="text-[42px] leading-[45px] font-semibold text-text">
            SIMPILIFIQUE SUA OPERAÇÃO E{" "}
            <span className="font-bold text-neutral-900">
              MAXIMIZE SEUS RESULTADOS
            </span>{" "}
            COM TECNOLOGIA INOVADORA.
          </span>
          <Button className='rounded-full bg-white text-neutrals hover:bg-white/80 font-bold'>Contate-nos</Button>
        </div>
      </div>
    </div>
  )
}