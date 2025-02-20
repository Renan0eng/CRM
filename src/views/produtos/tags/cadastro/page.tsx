"use client"
import { TagDataTable } from "@/components/tables/prostutos/tags/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlert } from "@/hooks/use-alert";
import { createTagOrUpdate, getTagByid, getTags } from "@/models/produtos";
import { cadastroTagSchema, CadastroTagSchema } from "@/Schemas/produto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CadastroTagOrEdit({
  defaultValues
}: {
  defaultValues?: CadastroTagSchema
}) {

  useEffect(() => {

    console.log("defaultValues: ", defaultValues);


  }, [defaultValues])

  const router = useRouter();
  const [error, setError] = useState<string | null>(null)


  const alert = useAlert();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CadastroTagSchema>({
    resolver: zodResolver(cadastroTagSchema),
    defaultValues: defaultValues
  })

  const onSubmit = async (data: CadastroTagSchema) => {
    console.log(data);

    try {


      const response = await createTagOrUpdate(data);

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
        <span className="text-4xl font-bold" >{defaultValues ? "Edição" : "Cadastro"} de Tag</span>
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
            <div className="w-full gap-2">
              <Label className="text-text-foreground font-semibold text-md" htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                type="nome"
                placeholder="ex. Ração"
                {...register("nome")}
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
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
      <TagDataTable />
    </div >
  )
}