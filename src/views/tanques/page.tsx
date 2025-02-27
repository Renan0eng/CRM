"use client"
import { ChartFullLine } from "@/components/charts/chartFullLine";
import { ChartRacaoBar } from "@/components/charts/chartRacaoBar";
import { ChartRacaoPie } from "@/components/charts/chartRacaoPie";
import { LoteDataTable } from "@/components/tables/lotesTable/table";
import { TanqueDataTable } from "@/components/tables/tanques/table";
import { Button } from "@/components/ui/button";
import { Plus, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Tanques() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/admin/tanques/cadastro");
    router.prefetch("/admin");
  }, [])

  return (
    <div className="w-full text-text flex p-4 flex-col gap-4 scrollable overflow-scroll h-full">
      <div className="flex w-full justify-between">
        <span className="text-4xl font-bold" >Tanques</span>
        <div className="flex gap-4 font-bold">
          <Button variant="outline" className="w-full"
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
          >
            <Undo2 />
            Voltar
          </Button>
          <Button className="w-full"
            onClick={(e) => {
              e.preventDefault();
              router.push("/admin/tanques/cadastro");
            }}
          >
            <Plus />
            Cadastrar
          </Button>
        </div>
      </div >
      <div className="flex w-full gap-4 flex-col xxl:flex-row">
        {/* Table */}
        <TanqueDataTable />
        {/* Cards */}
        <div className="w-full gap-4 flex flex-col xl:flex-row xxl:flex-col">
          {/* Ração */}
          <div className="px-4 py-8 bg-background-foreground rounded-md w-full flex  flex-col  sm:flex-row xl:flex-row">
            <div className="flex flex-col justify-between h-full w-full">
              <div>
                <p className="text-xl font-bold">Consumo de Ração</p>
                <p>January - June 2024</p>
              </div>
              <div>
                <ChartRacaoBar />
              </div>
            </div>
            <ChartRacaoPie />
          </div>
          {/* Engorda */}
          <div className="px-4 py-8 bg-background-foreground rounded-md w-full flex  flex-col-reverse  sm:flex-row xl:flex-row">
            <ChartRacaoPie />
            <div className="flex w-full flex-col">
              <div className="flex gap-4">
                <div>
                  <p className="text-xl font-bold">Total Kg</p>
                  <p>January - June 2024</p>
                </div>
              </div>
              <div>
                <ChartRacaoBar />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ChartFullLine />
      </div>
    </div >
  )
}