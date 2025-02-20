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