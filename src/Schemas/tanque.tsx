import * as z from "zod";

export const cadastroTanqueSchema = z.object({
  id_lote: z.string().min(1, "ID do lote é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(), // Campo opcional
  kg: z.number().refine((val) => val >= 0, {
    message: "O valor de 'kg' deve ser maior ou igual a 0",
  }),
  qtd: z.number().refine((val) => val >= 0, {
    message: "O valor de 'qtd' deve ser maior ou igual a 0",
  }),
  area: z.number().refine((val) => val >= 0, {
    message: "O valor de 'area' deve ser maior ou igual a 0",
  }).default(0), // Valor padrão de 0
});

// Inferindo o tipo TypeScript a partir do schema
export type CadastroTanqueSchema = z.infer<typeof cadastroTanqueSchema>;