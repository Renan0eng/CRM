"use server";

import { getUserId } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma, ProdutoMovimento } from "@prisma/client";

export type CreateProdutoMovimento = Omit<
  Prisma.ProdutoMovimentoCreateInput,
  "user_created_id"
> &
  Partial<Pick<Prisma.ProdutoMovimentoCreateInput, "id">> & {
    tag?: string[] | undefined;
  };

export async function createProdutoMovimentoOrUpdate(
  data: CreateProdutoMovimento
): Promise<{ message: string; status: boolean }> {
  const user_created_id = await getUserId();

  if (user_created_id === false)
    return { message: "Error ao validar usuario", status: false };

  if (data.id) {
    const produtoMovimento = await prisma.produtoMovimento.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        user_created_id,
      },
    });
    if (produtoMovimento) {
      return { message: "ProdutoMovimento Editado Com Sucesso", status: true };
    }
    return { message: "Erro ao criar produtoMovimento", status: false };
  } else {
    const produtoMovimento = await prisma.produtoMovimento.create({
      data: {
        ...data,
        user_created_id,
      },
    });

    if (produtoMovimento) {
      return {
        message: "ProdutoMovimento Cadastrado Com Sucesso",
        status: true,
      };
    }

    return { message: "Erro ao criar produtoMovimento", status: false };
  }
}

export type ProdutoMovimentoProduto = Prisma.ProdutoMovimentoGetPayload<{
  include: {
    Produto: true;
  };
}>;

export async function getProdutoMovimentos(
  take: number = 10,
  page: number = 0,
  filter?: string,
  sortBy: string = "created",
  sortOrder: "asc" | "desc" = "asc"
): Promise<{
  message: string;
  status: boolean;
  data?: {
    produtoMovimentos: ProdutoMovimentoProduto[];
    pages: number;
    qtd: number;
  };
}> {
  const user_id = await getUserId();

  if (user_id === false)
    return { message: "Erro ao validar usuário", status: false };

  try {
    // Busca os dados paginados
    const produtoMovimento = await prisma.produtoMovimento.findMany({
      where: {
        user_created_id: user_id,
        ...(filter && {
          OR: [{ descricao: { contains: filter, mode: "insensitive" } }],
        }),
      },
      orderBy: { [sortBy]: sortOrder },
      take: take,
      skip: take * page,
      include: {
        Produto: true,
      },
    });

    // Conta o total de registros para calcular as páginas
    const totalRecords = await prisma.produtoMovimento.count({
      where: {
        user_created_id: user_id,
        ...(filter && {
          OR: [
            { descricao: { contains: filter, mode: "insensitive" } }, // Filtra pelo campo 'descricao'
          ],
        }),
      },
    });

    if (produtoMovimento) {
      return {
        message: "ProdutoMovimentos encontrados",
        status: true,
        data: {
          produtoMovimentos: produtoMovimento,
          pages: Math.ceil(totalRecords / take), // Calcula o número de páginas
          qtd: totalRecords, // Total de registros
        },
      };
    }
  } catch (error) {
    console.error("Erro ao buscar produtoMovimentos:", error);
    return { message: "Erro ao buscar produtoMovimentos", status: false };
  }

  return { message: "ProdutoMovimentos não encontrados", status: false };
}

export async function getProdutoMovimentoByid(
  id: string
): Promise<ProdutoMovimento | null> {
  const produtoMovimento = await prisma.produtoMovimento.findFirst({
    where: {
      id,
    },
  });

  return produtoMovimento;
}

export async function deleteProdutoMovimentoByIds(ids: string[]): Promise<{
  message: string;
  status: boolean;
}> {
  try {
    const tag = await prisma.produtoMovimento.deleteMany({
      where: {
        id: {
          in: ids, // Exclui todos os tags cujo ID está no array `ids`
        },
      },
    });

    console.log(`Foram excluídos ${tag.count} registros.`);
    return {
      message: `Foram excluídos ${tag.count} registros.`,
      status: true,
    };
  } catch (error) {
    console.error("Erro ao excluir tags:", error);
    return {
      message: `Erro ao excluir tags: ${error} registros.`,
      status: false,
    };
  }
}
