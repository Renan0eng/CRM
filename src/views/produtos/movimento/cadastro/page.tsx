"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlert } from "@/hooks/use-alert";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { cadastroMovimentoSchema, CadastroMovimentoSchema } from "@/Schemas/produto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lote, Produto, Tanque } from "@prisma/client";
import { CalendarIcon, Save, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreateProdutoMovimento, createProdutoMovimentoOrUpdate } from "@/models/movimento";
import { MovimentoDataTable } from "@/components/tables/prostutos/movimentos/table";

export default function CadastroMovimentoOrEdit({
  defaultValues,
  lotes,
  tanques,
  produtos
}: {
  defaultValues?: CadastroMovimentoSchema,
  produtos: Produto[],
  lotes: Lote[],
  tanques: Tanque[]
}) {

  const router = useRouter();
  const [error, setError] = useState<string | null>(null)

  const [linkMov, setLinkMov] = useState<{
    id: string,
    nome: string,
    tipo: string
  }[]>()

  const [filtroLink, setFiltroLink] = useState<string>()

  const refFiltroLink = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLinkMov([...lotes.map((lote) => {
      return {
        id: lote.id,
        nome: lote.nome,
        tipo: "Lote"
      }
    }), ...tanques.map((tanque) => {
      return {
        id: tanque.id,
        nome: tanque.nome,
        tipo: "Tanque"
      }
    })])
  }, [lotes, tanques])

  const alert = useAlert();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CadastroMovimentoSchema>({
    resolver: zodResolver(cadastroMovimentoSchema),
    defaultValues: defaultValues || {
      data_movimento: new Date(),
      tipo: "saida"
    }
  })

  useEffect(() => {
    if (filtroLink) {
      const filtrado = [...lotes.map((lote) => {
        return {
          id: lote.id,
          nome: lote.nome,
          tipo: "Lote"
        }
      }), ...tanques.map((tanque) => {
        return {
          id: tanque.id,
          nome: tanque.nome,
          tipo: "Tanque"
        }
      })].filter((e) => {
        return e.nome.toLowerCase().includes(filtroLink.toLowerCase());
      });
      setLinkMov(filtrado);
    } else
      setLinkMov([...lotes.map((lote) => {
        return {
          id: lote.id,
          nome: lote.nome,
          tipo: "Lote"
        }
      }), ...tanques.map((tanque) => {
        return {
          id: tanque.id,
          nome: tanque.nome,
          tipo: "Tanque"
        }
      })])
  }, [filtroLink])


  const onSubmit = async (data: CadastroMovimentoSchema) => {
    console.log(data);

    try {


      const { id_lote, id_tanque, id_produto, ...send } = data;

      let produtoMov = {
        ...send,
        Produto: { connect: { id: data.id_produto } }
      } as CreateProdutoMovimento;

      if (id_lote) {
        produtoMov.lote = { connect: { id: data.id_lote } };
      }

      if (id_tanque) {
        produtoMov.tanque = { connect: { id: data.id_tanque } };
      }

      const response = await createProdutoMovimentoOrUpdate(produtoMov);

      if (response) {
        if (response.status) {
          if (defaultValues) {
            router.back();
          }
          reset();
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
        <span className="text-4xl font-bold" >{defaultValues ? "Edição" : "Cadastro"} de Movimento</span>
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
                <Label className="text-text-foreground font-semibold text-md" htmlFor="id_lote">Destino Movimento (Lote / Tanque)</Label>
                <Select value={(watch("id_lote") && `Lote-${watch("id_lote")}`) || (watch("id_tanque") && `Tanque-${watch("id_tanque")}`)} onValueChange={(e: string) => {
                  const link = e.split("-")
                  if (link[0] === "Lote") {
                    setValue("id_lote", link[1]);
                    setValue("id_tanque", undefined);
                  }
                  if (link[0] === "Tanque") {
                    setValue("id_tanque", link[1]);
                    setValue("id_lote", undefined);
                  }
                }}>
                  <SelectTrigger className="w-full" >
                    <SelectValue placeholder="Selecionar Destino" />
                  </SelectTrigger>
                  <SelectContent onKeyDownCapture={(e) => refFiltroLink.current?.focus()}>
                    <Input className="w-full h-9"
                      ref={refFiltroLink}
                      placeholder="Filtar..."
                      type="text"
                      value={filtroLink}
                      onChange={(e) => {
                        console.log(e.isDefaultPrevented())
                        setFiltroLink(e.target.value)
                      }}
                    />
                    <SelectGroup>
                      <SelectLabel>Tanques e Lotes</SelectLabel>
                      {linkMov?.length ? linkMov.map((link) => <SelectItem value={`${link.tipo}-${link.id}`} >{link.tipo} - {link.nome}</SelectItem>) :
                        <SelectLabel className="text-sm font-light">Dado não encontado...</SelectLabel>}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {(errors.id_lote || errors.id_tanque) && (
                  <p className="text-sm text-red-500">{errors.id_lote?.message || errors.id_tanque?.message}</p>
                )}
              </div>
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="id_lote">Produto</Label>
                <Select value={watch("id_produto")} onValueChange={(e) => setValue("id_produto", e)}>
                  <SelectTrigger className="w-full" >
                    <SelectValue placeholder="Produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Produto</SelectLabel>
                      {produtos?.length ? produtos.map((produto) => <SelectItem value={`${produto.id}`} >{produto.nome}</SelectItem>) :
                        <SelectLabel className="text-sm font-light">Dado não encontado...</SelectLabel>}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.id_produto && (
                  <p className="text-sm text-red-500">{errors.id_produto.message}</p>
                )}
              </div>
            </div>
            <div className=" flex flex-col w-full gap-8 md:flex-row">
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="tipo">Tipo</Label>
                <Select value={watch("tipo")} onValueChange={(e: any) => {
                  setValue("tipo", e)
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar Visibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Visibilidade</SelectLabel>
                      <SelectItem value={"entrada"} >Entrada</SelectItem>
                      <SelectItem value={"saida"} >Saida</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.tipo && (
                  <p className="text-sm text-red-500">{errors.tipo.message}</p>
                )}
              </div>
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
                    const rawValue = e.target.value.replace(",", ".");
                    const parsedValue = parseFloat(rawValue);
                    const fixedValue = parseFloat(parsedValue.toFixed(4))
                    setValue("qtd", isNaN(fixedValue) ? 0 : fixedValue);
                  }}
                />
                {errors.qtd && (
                  <p className="text-sm text-red-500">{errors.qtd.message}</p>
                )}
              </div>
            </div>
            <div className=" flex flex-col w-full gap-8 md:flex-row">
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
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="data_movimento">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-input-border bg-input-background",
                        !watch("data_movimento") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {watch("data_movimento") ? format(watch("data_movimento") || new Date(), "PPP", { locale: ptBR }) : <span>Data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={watch("data_movimento")}
                      onSelect={(e) => setValue("data_movimento", e || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.data_movimento && (
                  <p className="text-sm text-red-500">{errors.data_movimento.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-row-reverse w-full">
              <div className="flex flex-col md:flex-row w-full md:w-[25%] gap-8 p-0 md:pl-4">
                <Button type="submit" className="w-full">
                  <Save />
                  {defaultValues ? "Editar" : "Cadastrar"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="w-full h-full ">
        <MovimentoDataTable />
      </div>
    </div >
  )
}