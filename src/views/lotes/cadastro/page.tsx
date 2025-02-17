"use client"
import { LoteDataTable } from "@/components/tables/lotesTable/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlert } from "@/hooks/use-alert";
import { cn } from "@/lib/utils";
import { createLoteOrUpdate, getLoteByid } from "@/models/lote";
import { CadastroLoteSchema, cadastroLoteSchema } from "@/Schemas/Lote";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Save, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CadastroLoteOrEdit({
  idLote
}: {
  idLote?: string
}) {

  const router = useRouter();
  const [error, setError] = useState<string | null>(null)

  const alert = useAlert();

  const getData = async (idLote: string) => {

    const lote = await getLoteByid(idLote);

    if (lote) {
      setValue("nome", lote.nome);
      setValue("estagio", lote.estagio);
      setValue("entrada", lote.entrada);
      setValue("descricao", lote.descricao || "");
      setValue("kg", lote.kg || 0);
      setValue("qtd", lote.qtd || 0);
    } else {
      router.back()
    }

  };

  useEffect(() => {

    if (idLote) {
      getData(idLote)
    }

  }, [idLote])

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CadastroLoteSchema>({
    resolver: zodResolver(cadastroLoteSchema),
    defaultValues: {
      entrada: new Date(),
      estagio: 'cria',
      kg: 0,
      qtd: 0
    }
  })

  const onSubmit = async (data: CadastroLoteSchema) => {
    console.log(data);

    try {

      const response = await createLoteOrUpdate({
        ...data,
        id: idLote,
        kg: typeof data.kg === "number" ? data.kg : 0,
        qtd: typeof data.qtd === "number" ? data.qtd : 0,
      })

      if (response) {
        if (response.status) {
          if (idLote) {
            router.back();
          } else {
            reset();
          }
        }
        alert.setAlert(
          response.message,
          response.status ? "success" : "error"
        )
      } else {
        setError("Invalid credentials")
        alert.setAlert(
          "Invalid credentials",
          "error"
        )
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <div className="w-full text-text flex p-4 flex-col gap-4 scrollable overflow-scroll h-full">
      <div className="flex w-full justify-between">
        <span className="text-4xl font-bold" >Cadastro de Lote</span>
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
        </div>
      </div >
      <div className="px-4 py-8 bg-background-foreground rounded-md w-full" >
        <form onSubmit={handleSubmit(onSubmit)} className="text-text-foreground">
          <div className="flex flex-col gap-8">
            <div className=" flex flex-col w-full gap-8 md:flex-row">
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  type="nome"
                  placeholder="ex. 001"
                  {...register("nome")}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500">{errors.nome.message}</p>
                )}
              </div>
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  type="descricao"
                  placeholder="ex. Peixe sadio...."
                  {...register("descricao")}
                />
                {errors.descricao && (
                  <p className="text-sm text-red-500">{errors.descricao.message}</p>
                )}
              </div>

            </div>
            <div className="flex flex-col w-full gap-8 md:flex-row">
              {/* Campo KG */}
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="kg">
                  Kg
                </Label>
                <Input
                  id="kg"
                  value={watch("kg") === 0 ? "" : watch("kg")}
                  type="number"
                  placeholder="ex. 12,345"
                  className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(",", ".");
                    const parsedValue = parseFloat(rawValue);
                    const fixedValue = parseFloat(parsedValue.toFixed(4))
                    setValue("kg", isNaN(fixedValue) ? 0 : fixedValue);
                  }}
                />
                {errors.kg && (
                  <p className="text-sm text-red-500">{errors.kg.message}</p>
                )}
              </div>

              {/* Campo Quantidade */}
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="qtd">
                  Quantidade
                </Label>
                <Input
                  id="qtd"
                  value={watch("qtd") === 0 ? "" : watch("qtd")}
                  type="number"
                  placeholder="ex. 1234"
                  className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
                    const parsedValue = parseInt(rawValue, 10); // Converte para inteiro
                    setValue("qtd", isNaN(parsedValue) ? 0 : parsedValue); // Define o valor ou 0 se for NaN
                  }}
                />
                {errors.qtd && (
                  <p className="text-sm text-red-500">{errors.qtd.message}</p>
                )}
              </div>
            </div>
            <div className=" flex flex-col w-full gap-8 md:flex-row">
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="estagio">Estagio</Label>
                <Select value={watch("estagio")} onValueChange={(e: any) => setValue("estagio", e)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Estagios</SelectLabel>
                      <SelectItem value="cria">Cria</SelectItem>
                      <SelectItem value="recria">Recria</SelectItem>
                      <SelectItem value="engorda">Engorda</SelectItem>
                      <SelectItem value="abate">Abate</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.estagio && (
                  <p className="text-sm text-red-500">{errors.estagio.message}</p>
                )}
              </div>
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="entrada">Data Entrada</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-input-border bg-input-background",
                        !watch("entrada") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {watch("entrada") ? format(watch("entrada"), "PPP", { locale: ptBR }) : <span>Data Entrada</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={watch("entrada")}
                      onSelect={(e) => setValue("entrada", e || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.entrada && (
                  <p className="text-sm text-red-500">{errors.entrada.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-row-reverse w-full">
              <div className="flex flex-col md:flex-row w-full md:w-[25%] gap-8 p-0 md:pl-4">
                <Button type="submit" className="w-full">
                  <Save />
                  {idLote ? "Editar" : "Cadastrar"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <LoteDataTable />
    </div >
  )
}