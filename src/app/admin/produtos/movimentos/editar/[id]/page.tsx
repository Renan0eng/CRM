import { getProdutoByid, getTags } from "@/models/produtos";
import CadastroProdutoOrEdit from "@/views/produtos/cadastro/page";
import { Description } from "@radix-ui/react-dialog";

export default async function Page({ params: { id }, }: { params: { id: string; }; }) {

  const produto = await getProdutoByid(id);

  const defaultValues = {
    id: produto?.id,
    nome: produto?.nome || "",
    image_url: produto?.image_url || "",
    type_med: produto?.type_med as "unidade" | "kg",
    visivel: produto?.visivel || false,
    descricao: produto?.descricao || undefined,
    preco: produto?.preco || undefined,
    custo: produto?.custo || undefined,
    tag: produto?.tag[0]?.id || undefined
  }

  const tags = await getTags(99999);

  return (<CadastroProdutoOrEdit defaultValues={defaultValues} tags={tags.data?.tags || []} />)
}