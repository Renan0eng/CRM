import * as z from "zod";

export const typeMedEnum = z.enum(["unidade", "kg"]);

export const cadastroProdutoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  preco: z.number().refine((val) => val >= 0, {
    message: "O valor de 'preco' deve ser maior ou igual a 0",
  }).optional(),
  custo: z.number().refine((val) => val >= 0, {
    message: "O valor de 'custo' deve ser maior ou igual a 0",
  }).optional(),
  image_url: z.string().optional(),
  type_med: typeMedEnum.default("unidade"),
  visivel: z.boolean().default(true),
  tag: z.string().optional(),
});

export type CadastroProdutoSchema = z.infer<typeof cadastroProdutoSchema>;


export const cadastroTagSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
});

export type CadastroTagSchema = z.infer<typeof cadastroTagSchema>;


export const cadastroMovimentoSchema = z.object({
  id: z.string().optional(),
  tipo: z.enum(["entrada", "saida"], {
    errorMap: () => ({ message: "Estágio inválido. Deve ser 'entrada' ou 'saida'" }),
  }),
  qtd: z.number().refine((val) => val > 0, {
    message: "A quantidade deve ser maior que 0",
  }),
  descricao: z.string().optional(),
  id_produto: z.string().min(1, "O ID do produto é obrigatório"),
  id_lote: z.string().optional(),
  id_tanque: z.string().optional(),
  data_movimento: z.date().optional(),
});

// Inferindo o tipo TypeScript a partir do schema Zod
export type CadastroMovimentoSchema = z.infer<typeof cadastroMovimentoSchema>;