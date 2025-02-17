"use server";

import { getUserId } from "@/lib/auth";
import prisma from "@/lib/db";
import { Lote, Prisma } from "@prisma/client";

type CreateLote = Omit<Prisma.LoteCreateInput, "user_created_id"> &
  Partial<Pick<Prisma.LoteCreateInput, "id">>;

export async function createLoteOrUpdate(
  data: CreateLote
): Promise<{ message: string; status: boolean }> {
  const user_created_id = await getUserId();

  if (user_created_id === false)
    return { message: "Error ao validar usuario", status: false };

  if (data.id) {
    const lote = await prisma.lote.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        user_created_id,
      },
    });
    if (lote) {
      return { message: "Lote Editado Com Sucesso", status: true };
    }
    return { message: "Erro ao criar lote", status: false };
  } else {
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
  return { message: "Erro ao criar lote", status: false };
}

export async function getlotes(
  take: number = 10,
  page: number = 0,
  filter?: string, // Filtro opcional (ex.: email, nome, etc.)
  sortBy: string = "created", // Campo padrão para ordenação
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
      orderBy: { [sortBy]: sortOrder },
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

export async function getLoteByid(id: string): Promise<Lote | null> {
  const lote = await prisma.lote.findFirst({
    where: {
      id,
    },
  });

  return lote;
}

export async function deleteLoteByIds(ids: string[]): Promise<{
  message: string;
  status: boolean;
}> {
  try {
    const lote = await prisma.lote.deleteMany({
      where: {
        id: {
          in: ids, // Exclui todos os lotes cujo ID está no array `ids`
        },
      },
    });

    console.log(`Foram excluídos ${lote.count} registros.`);
    return {
      message: `Foram excluídos ${lote.count} registros.`,
      status: true,
    };
  } catch (error) {
    console.error("Erro ao excluir lotes:", error);
    return {
      message: `Erro ao excluir lotes: ${error} registros.`,
      status: false,
    };
  }
}
