import { getTags } from "@/models/produtos";
import CadastroProdutoOrEdit from "@/views/produtos/cadastro/page";

export default async function Page() {
  const tags = await getTags(99999);
  return (<CadastroProdutoOrEdit tags={tags.data?.tags || []} />)
}