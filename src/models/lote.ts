"use server";

import { getUserId } from "@/lib/auth";
import prisma from "@/lib/db";
import { Lote, Prisma } from "@prisma/client";

type CreateLote = Omit<Prisma.LoteCreateInput, "id" | "user_created_id">;

export async function createLote(
  data: CreateLote
): Promise<{ message: string; status: boolean }> {
  const user_created_id = await getUserId();

  if (user_created_id === false)
    return { message: "Error ao validar usuario", status: false };

  console.log("data: ", data);

  const lote = await prisma.lote.create({
    data: {
      ...data,
      user_created_id,
    },
  });
  if (lote) {
    return { message: "Lote Cadastrado Com Sucesso", status: true };
  }
  return { message: "Erro ao criar lote", status: false };
}

export async function getlotes(
  take: number = 10,
  page: number = 0,
  filter?: string, // Filtro opcional (ex.: email, nome, etc.)
  sortBy: string = "id", // Campo padrão para ordenação
  sortOrder: "asc" | "desc" = "asc" // Ordem padrão
): Promise<{
  message: string;
  status: boolean;
  data?: {
    lotes: Lote[];
    pages: number;
    qtd: number;
  };
}> {
  const user_id = await getUserId();

  if (user_id === false)
    return { message: "Erro ao validar usuário", status: false };

  try {
    // Busca os dados paginados
    const lote = await prisma.lote.findMany({
      where: {
        user_created_id: user_id,
        ...(filter && {
          OR: [
            { nome: { contains: filter, mode: "insensitive" } }, // Filtra pelo campo 'nome'
            { descricao: { contains: filter, mode: "insensitive" } }, // Filtra pelo campo 'descricao'
          ],
        }),
      },
      orderBy: { [sortBy]: sortOrder }, // Ordenação dinâmica
      take: take,
      skip: take * page,
    });

    // Conta o total de registros para calcular as páginas
    const totalRecords = await prisma.lote.count({
      where: {
        user_created_id: user_id,
        ...(filter && {
          OR: [
            { nome: { contains: filter, mode: "insensitive" } }, // Filtra pelo campo 'nome'
            { descricao: { contains: filter, mode: "insensitive" } }, // Filtra pelo campo 'descricao'
          ],
        }),
      },
    });

    if (lote) {
      return {
        message: "Lotes encontrados",
        status: true,
        data: {
          lotes: lote,
          pages: Math.ceil(totalRecords / take), // Calcula o número de páginas
          qtd: totalRecords, // Total de registros
        },
      };
    }
  } catch (error) {
    console.error("Erro ao buscar lotes:", error);
    return { message: "Erro ao buscar lotes", status: false };
  }

  return { message: "Lotes não encontrados", status: false };
}
