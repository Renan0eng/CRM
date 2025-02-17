"use server";

import { getUserId } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma, Tanque } from "@prisma/client";

type CreateTanque = Omit<Prisma.TanqueCreateInput, "user_created_id"> &
  Partial<Pick<Prisma.TanqueCreateInput, "id">>;

export async function createTanqueOrUpdate(
  data: CreateTanque
): Promise<{ message: string; status: boolean }> {
  const user_created_id = await getUserId();

  if (user_created_id === false)
    return { message: "Error ao validar usuario", status: false };

  if (data.id) {
    const tanque = await prisma.tanque.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        user_created_id,
      },
    });
    if (tanque) {
      return { message: "Tanque Editado Com Sucesso", status: true };
    }
    return { message: "Erro ao criar tanque", status: false };
  } else {
    const tanque = await prisma.tanque.create({
      data: {
        ...data,
        user_created_id,
      },
    });
    if (tanque) {
      return { message: "Tanque Cadastrado Com Sucesso", status: true };
    }

    return { message: "Erro ao criar tanque", status: false };
  }
}

export async function getTanques(
  take: number = 10,
  page: number = 0,
  filter?: string, // Filtro opcional (ex.: email, nome, etc.)
  sortBy: string = "created", // Campo padrão para ordenação
  sortOrder: "asc" | "desc" = "asc" // Ordem padrão
): Promise<{
  message: string;
  status: boolean;
  data?: {
    tanques: Tanque[];
    pages: number;
    qtd: number;
  };
}> {
  const user_id = await getUserId();

  if (user_id === false)
    return { message: "Erro ao validar usuário", status: false };

  try {
    // Busca os dados paginados
    const tanque = await prisma.tanque.findMany({
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
    const totalRecords = await prisma.tanque.count({
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

    if (tanque) {
      return {
        message: "Tanques encontrados",
        status: true,
        data: {
          tanques: tanque,
          pages: Math.ceil(totalRecords / take), // Calcula o número de páginas
          qtd: totalRecords, // Total de registros
        },
      };
    }
  } catch (error) {
    console.error("Erro ao buscar tanques:", error);
    return { message: "Erro ao buscar tanques", status: false };
  }

  return { message: "Tanques não encontrados", status: false };
}

export async function getTanqueByid(id: string): Promise<Tanque | null> {
  const lote = await prisma.tanque.findFirst({
    where: {
      id,
    },
  });

  return lote;
}

export async function deleteTanqueByIds(ids: string[]): Promise<{
  message: string;
  status: boolean;
}> {
  try {
    const lote = await prisma.tanque.deleteMany({
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
