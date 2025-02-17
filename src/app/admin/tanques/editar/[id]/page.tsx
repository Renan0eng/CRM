import CadastroTanqueOrEdit from "@/views/tanques/cadastro/page";

export default function Page({ params: { id }, }: { params: { id: string; }; }) {
  return (<CadastroTanqueOrEdit idTanque={id} />)
}