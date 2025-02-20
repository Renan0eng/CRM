import { getlotes } from "@/models/lote";
import { getProdutos } from "@/models/produtos";
import { getTanques } from "@/models/tanque";
import CadastroMovimentoOrEdit from "@/views/produtos/movimento/cadastro/page";
import { Lote, Produto, Tanque } from "@prisma/client";

export default async function Page() {
  const tanques = await getTanques(99999) as { data: { tanques: Tanque[] } };
  const produtos = await getProdutos(99999) as { data: { produtos: Produto[] } };
  const lotes = await getlotes(99999) as { data: { lotes: Lote[] } };

  return (<CadastroMovimentoOrEdit
    tanques={tanques.data?.tanques}
    produtos={produtos.data?.produtos}
    lotes={lotes.data?.lotes}
  />)
}