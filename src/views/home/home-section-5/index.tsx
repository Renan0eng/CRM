
import { Button } from "@/components/ui/button";
import Precos from "./preco-desconto";
import { Bird, Fish, Leaf, LucideBuilding2, Sparkles } from "lucide-react";

export default function HomeSection5() {
  return (
    <div className="md:p-16 p-4 bg-white bg-opacity-50 rounded-2xl flex-col justify-center items-center gap-16 inline-flex">
      <div className="grid grid-cols-1 xl:grid-cols-2
      2xl:grid-cols-3 gap-16 w-full">
        <Precos
          valor={0}
          name="Alevino"
          lista={[
            "Gerencie até 3 lotes simultaneamente",
            "Monitoramento básico de mortalidade",
            "Relatórios simplificados de crescimento",
            "Cadastro de produtos limitado",
            "Sem suporte prioritário",
            "Interface intuitiva e fácil de usar"
          ]}
          link="/plano-alevino"
          icon={Fish}
        />
        <Precos
          valor={549.90}
          desconto={80}
          name="Crescimento"
          destaque="Mais Popular"
          lista={[
            "Gerencie até 50 lotes simultaneamente",
            "Monitoramento avançado de biometria",
            "Fechamento automático de lotes",
            "Linkagem de lotes (pai-filho)",
            "Controle de estoque de produtos",
            "Relatórios de crescimento e mortalidade",
            "Suporte técnico via chat"
          ]}
          link="/plano-crescimento"
          icon={Leaf}
        />
        <Precos
          valor={890.90}
          desconto={50}
          name="Produção Premium"
          lista={[
            "Gerencie lotes ilimitados",
            "Monitoramento financeiro completo",
            "Conversão alimentar detalhada",
            "Relatórios avançados (PDF/Excel)",
            "Automação total de processos",
            "Treinamento personalizado para sua equipe",
            "Suporte prioritário 24/7",
            "Integração com sistemas externos",
            "Modelo avançado de análise de dados"
          ]}
          link="/plano-premium"
          icon={Sparkles}
        />
      </div>
      <div className="mt-5 p-8 bg-neutral-50 rounded-[32px] shadow-md flex-col  flex gap-4 w-full h-full">
        <div className="w-full lg:w-1/3">
          <div className="flex flex-row gap-2">
            <LucideBuilding2 className="text-primary-500" size={25} />
            <span className="text-black text-2xl font-bold leading-normal">Empresa</span>
          </div>
          <span>Entre em contato conosco para criar um plano expeifico para você</span>
        </div>
        <div>
          <Button className="bg-primary-500 text-white rounded-full hover:bg-primary-600	">Contate-nos</Button>
        </div>
      </div>
    </div>
  );
}
