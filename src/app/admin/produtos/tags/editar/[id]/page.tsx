import { getTagByid } from "@/models/produtos";
import CadastroTagOrEdit from "@/views/produtos/tags/cadastro/page";

export default async function Page({ params: { id }, }: { params: { id: string; }; }) {

  const produto = await getTagByid(id);

  const defaultValues = {
    id: produto?.id,
    nome: produto?.nome || "",
  }

  console.log(defaultValues);


  return (<CadastroTagOrEdit defaultValues={defaultValues} />)
}