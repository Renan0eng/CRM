"use client"
import { ChartFullLine } from "@/components/charts/chartFullLine";
import { ChartRacaoBar } from "@/components/charts/chartRacaoBar";
import { ChartRacaoPie } from "@/components/charts/chartRacaoPie";
import { LoteDataTable } from "@/components/tables/lotesTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Lotes() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/admin/lotes/cadastro");
    router.prefetch("/admin");
  }, [])

  return (
    <div className="w-full text-text flex p-4 flex-col gap-4 scrollable overflow-scroll h-full">
      <div className="flex w-full justify-between">
        <span className="text-4xl font-bold" > Lotes</span>
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
              router.push("/admin/lotes/cadastro");
            }}
          >
            <Plus />
            Cadastrar
          </Button>
        </div>
      </div >
      <div className="flex w-full gap-4">
        {/* Table */}
        <LoteDataTable />
        {/* Cards */}
        <div className="w-full gap-4 flex flex-col ">
          {/* Ração */}
          <div className="px-4 py-8 bg-background-foreground rounded-md w-full flex h-[50%]">
            <div className="flex w-full flex-col">
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
          <div className="px-4 py-8 bg-background-foreground rounded-md w-full flex h-[50%]">
            <ChartRacaoPie />
            <div className="flex w-full flex-col">
              <div className="flex gap-4">
                <div>
                  <p className="text-xl font-bold">Consumo de Ração</p>
                  <p>January - June 2024</p>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Periodo" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-input-border text-text">
                    <SelectGroup>
                      <SelectItem value="janeiro">Janeiro</SelectItem>
                      <SelectItem value="fevereiro">Fevereiro</SelectItem>
                      <SelectItem value="marco">Março</SelectItem>
                      <SelectItem value="abril">Abril</SelectItem>
                      <SelectItem value="maio">Maio</SelectItem>
                      <SelectItem value="junho">Junho</SelectItem>
                      <SelectItem value="julho">Julho</SelectItem>
                      <SelectItem value="agosto">Agosto</SelectItem>
                      <SelectItem value="setembro">Setembro</SelectItem>
                      <SelectItem value="outubro">Outubro</SelectItem>
                      <SelectItem value="novembro">Novembro</SelectItem>
                      <SelectItem value="dezembro">Dezembro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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