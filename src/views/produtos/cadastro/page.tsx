"use client"
import { ProdutoDataTable } from "@/components/tables/prostutos/table";
import { TanqueDataTable } from "@/components/tables/tanques/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlert } from "@/hooks/use-alert";
import { createProdutoOrUpdate, getProdutoByid, getTags } from "@/models/produtos";
import { CadastroProdutoSchema, cadastroProdutoSchema } from "@/Schemas/produto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lote, Produto_tag } from "@prisma/client";
import { Save, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CadastroProdutoOrEdit({
  defaultValues,
  tags
}: {
  defaultValues?: CadastroProdutoSchema,
  tags: Produto_tag[]
}) {

  const router = useRouter();
  const [error, setError] = useState<string | null>(null)

  const alert = useAlert();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CadastroProdutoSchema>({
    resolver: zodResolver(cadastroProdutoSchema),
    defaultValues: defaultValues
  })


  const onSubmit = async (data: CadastroProdutoSchema) => {
    console.log(data);

    try {

      const response = await createProdutoOrUpdate({ ...data, tag: [data.tag || ""] });

      if (response) {
        if (response.status) {
          if (defaultValues) {
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
        <span className="text-4xl font-bold" >{defaultValues ? "Edição" : "Cadastro"} de Produto</span>
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
                <Label className="text-text-foreground font-semibold text-md" htmlFor="preco">
                  Preço
                </Label>
                <Input
                  id="preco"
                  value={watch("preco") === 0 ? "" : watch("preco")}
                  type="number"
                  placeholder="ex. 12,345"
                  className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(",", ".");
                    const parsedValue = parseFloat(rawValue);
                    const fixedValue = parseFloat(parsedValue.toFixed(4))
                    setValue("preco", isNaN(fixedValue) ? 0 : fixedValue);
                  }}
                />
                {errors.preco && (
                  <p className="text-sm text-red-500">{errors.preco.message}</p>
                )}
              </div>

              {/* Campo Quantidade */}
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="custo">
                  Custo
                </Label>
                <Input
                  id="custo"
                  value={watch("custo") === 0 ? "" : watch("custo")}
                  type="number"
                  placeholder="ex. 1234"
                  className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(",", ".");
                    const parsedValue = parseFloat(rawValue);
                    const fixedValue = parseFloat(parsedValue.toFixed(4))
                    setValue("custo", isNaN(fixedValue) ? 0 : fixedValue);
                  }}
                />
                {errors.custo && (
                  <p className="text-sm text-red-500">{errors.custo.message}</p>
                )}
              </div>
            </div>
            <div className=" flex flex-col w-full gap-8 md:flex-row">
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="image_url">Image (Url)</Label>
                <Input
                  id="image_url"
                  type="image_url"
                  placeholder="ex. 001"
                  {...register("image_url")}
                />
                {errors.image_url && (
                  <p className="text-sm text-red-500">{errors.image_url.message}</p>
                )}
              </div>
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="type_med">Medida</Label>
                <Select value={watch("type_med")} onValueChange={(e: any) => {
                  setValue("type_med", e)
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar Medida" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipo Medida</SelectLabel>
                      <SelectItem value={"unidade"} >Unidade</SelectItem>
                      <SelectItem value={"kg"} >Kg</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.type_med && (
                  <p className="text-sm text-red-500">{errors.type_med.message}</p>
                )}
              </div>
            </div>
            <div className=" flex flex-col w-full gap-8 md:flex-row">
              <div className="w-full gap-2">
                <Label className="text-text-foreground font-semibold text-md" htmlFor="visivel">Visibilidade</Label>
                <Select value={JSON.stringify(watch("visivel"))} onValueChange={(e: any) => {
                  setValue("visivel", e === "true")
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar Visibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Visibilidade</SelectLabel>
                      <SelectItem value={"true"} >Visivel</SelectItem>
                      <SelectItem value={"false"} >Oculto</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.visivel && (
                  <p className="text-sm text-red-500">{errors.visivel.message}</p>
                )}
              </div>
              <div className="w-full gap-2">

                <Label className="text-text-foreground font-semibold text-md" htmlFor="id_lote">Tag</Label>
                {tags?.length ? <Select value={watch("tag")} onValueChange={(e: any) => {
                  const tag = watch("tag");
                  setValue("tag", e)
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tags</SelectLabel>
                      {tags?.length && tags.map((tag) => <SelectItem value={tag.id} >{tag.nome}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select> : <Select disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar Tag" />
                  </SelectTrigger>
                </Select>}
                {errors.tag && (
                  <p className="text-sm text-red-500">{errors.tag.message}</p>
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
        <ProdutoDataTable />
      </div>
    </div >
  )
}