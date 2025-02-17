import CadastroLoteOrEdit from "@/views/lotes/cadastro/page";

export default function Page({ params: { id }, }: { params: { id: string; }; }) {
  return (<CadastroLoteOrEdit idLote={id} />)
}