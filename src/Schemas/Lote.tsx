import * as z from "zod";

export const cadastroLoteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  kg: z
    .number().refine((val) => val >= 0)
    .optional(),
  qtd: z
    .number().int().refine((val) => val >= 0)
    .optional(),
  estagio: z.enum(["cria", "recria", "engorda", "abate"], {
    errorMap: () => ({ message: "Estágio inválido. Deve ser 'cria', 'recria', 'engorda' ou 'abate'" }),
  }),
  entrada: z.date({ required_error: "Data de entrada é obrigatória" }),
});

export type CadastroLoteSchema = z.infer<typeof cadastroLoteSchema>;