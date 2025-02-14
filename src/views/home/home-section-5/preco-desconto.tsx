import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Check, LucideIcon, OctagonX } from "lucide-react";

type Props = {
  valor: number;
  desconto?: number;
  name: string;
  destaque?: string;
  lista: string[];
  adicional?: string;
  className?: string;
  link: string;
  icon?: LucideIcon;
};

export default function Precos({ valor, desconto, name, destaque, lista, adicional, className, link, icon: Icon }: Props) {

  const card = cva(
    "mt-5 p-8 bg-neutral-50 rounded-[32px] shadow-md flex-col justify-between items-center flex gap-16 w-full h-full",
    {
      variants: {
        destaque: {
          false: "",
          true: "bg-primary-50 border-primary-500 border-2 ",
        },
      },
      defaultVariants: {
        destaque: false,
      },
    }
  )

  const main = cva(
    "relative items-center flex flex-col w-full h-full",
    {
      variants: {
        destaque: {
          false: "",
          true: "scale-110",
        },
      },
      defaultVariants: {
        destaque: false,
      }
    }
  )


  return (
    <div className={cn(main({ destaque: destaque ? true : false }), className)}>
      {destaque && <div className="px-6 py-3 bg-primary-500 rounded-full justify-center items-center gap-2.5 inline-flex absolute ">
        <div className="text-white text-md font-bold">{destaque}</div>
      </div>}
      <div className={cn(card({ destaque: destaque ? true : false }))}>
        <div className="flex flex-col gap-8 w-full items-center">
          <div className="flex flex-col">
            <div className="text-black text-2xl font-bold leading-normal flex flex-row items-center">
              {Icon && <Icon className="text-secondary-500" />}
              <span className="ml-2">{name}</span> {/* Nome ao lado do ícone */}
            </div>
            <div className="flex flex-col">
              {desconto && <div className="  justify-start items-end inline-flex">
                <div className="flex-col justify-start items-end inline-flex">
                  <div className="text-red-700 text-base font-semibold leading-normal line-through">R${
                    valor
                  }</div>
                </div>
                <div className="text-red-700 text-[8px] font-bold leading-[10px]">/mês</div>
              </div>}
              <div className=" justify-start items-end inline-flex">
                <div className="text-gray-600 text-[40px] font-bold leading-10">R${
                  desconto ? (valor - (valor * desconto / 100)).toFixed(0) : valor
                }</div>
                <div className="text-gray-600 text-2xl font-bold leading-normal">/mês</div>
              </div>
            </div>
          </div>
          <hr className="w-full h-0.5 bg-gray-200" />
          <div className="flex flex-col gap-3">
            {lista.map((e, id) => <div key={id} className="flex flex-row gap-2 items-center">
              <Check className="text-primary-500" size={20} />
              <span className="text-sm">{e}</span>
            </div>)}
          </div>
        </div>
        <div className="flex justify-center items-center flex-col gap-8">
          {adicional && <div className="flex flex-row gap-2 items-center">
            <OctagonX className="text-primary-500" size={20} />
            <span className="text-sm">{adicional}</span>
          </div>}
          <Link href={link}>
            <Button className="bg-primary-500 rounded-full hover:bg-primary-600 text-white font-bold gap-2">
              <span>Contratar</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}