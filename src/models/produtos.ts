"use server";

import { getUserId } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma, Produto_tag, Produto } from "@prisma/client";

type CreateProduto = Omit<Prisma.ProdutoCreateInput, "user_created_id"> &
  Partial<Pick<Prisma.ProdutoCreateInput, "id">> & {
    tag?: string[] | undefined;
  };

export async function createProdutoOrUpdate(
  data: CreateProduto
): Promise<{ message: string; status: boolean }> {
  const user_created_id = await getUserId();

  if (user_created_id === false)
    return { message: "Error ao validar usuario", status: false };

  if (data.id) {
    const dataConetedId = await prisma.produto.findFirst({
      where: {
        id: data.id,
      },
      include: {
        tag: true,
      },
    });

    dataConetedId?.tag.map(async (tag) => {
      await prisma.produto.update({
        where: {
          id: data.id,
        },
        data: {
          tag: {
            disconnect: [{ id: tag.id }],
          },
        },
      });
    });

    const { tag, ...rest } = data;

    const produto = await prisma.produto.update({
      where: {
        id: data.id,
      },
      data: {
        ...rest,
        user_created_id,
        tag: {
          connect: tag
            ?.filter((e) => e !== "")
            .map((tag) => {
              return { id: tag };
            }),
        },
      },
    });
    if (produto) {
      return { message: "Produto Editado Com Sucesso", status: true };
    }
    return { message: "Erro ao criar produto", status: false };
  } else {
    const { tag, ...rest } = data;

    const produto = await prisma.produto.create({
      data: {
        ...rest,
        user_created_id,
        tag: {
          connect: tag
            ?.filter((e) => e !== "")
            .map((tag) => {
              return { id: tag };
            }),
        },
      },
    });
    if (produto) {
      return { message: "Produto Cadastrado Com Sucesso", status: true };
    }

    return { message: "Erro ao criar produto", status: false };
  }
}

export async function getProdutos(
  take: number = 10,
  page: number = 0,
  filter?: string,
  sortBy: string = "created",
  sortOrder: "asc" | "desc" = "asc"
): Promise<{
  message: string;
  status: boolean;
  data?: {
    produtos: ProdutoTag[];
    pages: number;
    qtd: number;
  };
}> {
  const user_id = await getUserId();

  if (user_id === false)
    return { message: "Erro ao validar usuário", status: false };

  try {
    // Busca os dados paginados
    const produto = await prisma.produto.findMany({
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
      include: {
        tag: true,
      },
    });

    // Conta o total de registros para calcular as páginas
    const totalRecords = await prisma.produto.count({
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

    if (produto) {
      return {
        message: "Produtos encontrados",
        status: true,
        data: {
          produtos: produto,
          pages: Math.ceil(totalRecords / take), // Calcula o número de páginas
          qtd: totalRecords, // Total de registros
        },
      };
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return { message: "Erro ao buscar produtos", status: false };
  }

  return { message: "Produtos não encontrados", status: false };
}

export type ProdutoTag = Prisma.ProdutoGetPayload<{
  include: {
    tag: true;
  };
}>;

export async function getProdutoByid(id: string): Promise<ProdutoTag | null> {
  const produto = await prisma.produto.findFirst({
    where: {
      id,
    },
    include: {
      tag: true,
    },
  });

  return produto;
}

export async function deleteProdutoByIds(ids: string[]): Promise<{
  message: string;
  status: boolean;
}> {
  try {
    const produto = await prisma.produto.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    console.log(`Foram excluídos ${produto.count} registros.`);
    return {
      message: `Foram excluídos ${produto.count} registros.`,
      status: true,
    };
  } catch (error) {
    console.error("Erro ao excluir produtos:", error);
    return {
      message: `Erro ao excluir produtos: ${error} registros.`,
      status: false,
    };
  }
}

export async function getTags(
  take: number = 10,
  page: number = 0,
  filter?: string, // Filtro opcional (ex.: email, nome, etc.)
  sortBy: string = "id", // Campo padrão para ordenação
  sortOrder: "asc" | "desc" = "asc" // Ordem padrão
): Promise<{
  message: string;
  status: boolean;
  data?: {
    tags: Produto_tag[];
    pages: number;
    qtd: number;
  };
}> {
  const user_id = await getUserId();

  if (user_id === false)
    return { message: "Erro ao validar usuário", status: false };

  try {
    // Busca os dados paginados
    const tags = await prisma.produto_tag.findMany({
      where: {
        ...(filter && {
          OR: [{ nome: { contains: filter, mode: "insensitive" } }],
        }),
      },
      orderBy: { [sortBy]: sortOrder },
      take: take,
      skip: take * page,
    });

    // Conta o total de registros para calcular as páginas
    const totalRecords = await prisma.produto_tag.count({
      where: {
        ...(filter && {
          OR: [{ nome: { contains: filter, mode: "insensitive" } }],
        }),
      },
    });

    if (tags) {
      return {
        message: "Produtos encontrados",
        status: true,
        data: {
          tags: tags,
          pages: Math.ceil(totalRecords / take), // Calcula o número de páginas
          qtd: totalRecords, // Total de registros
        },
      };
    }
  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    return { message: "Erro ao buscar tags", status: false };
  }

  return { message: "Produtos não encontrados", status: false };
}

type CreateTag = {
  nome: string;
  id?: string;
};

export async function createTagOrUpdate(
  data: CreateTag
): Promise<{ message: string; status: boolean }> {
  const user_created_id = await getUserId();

  if (user_created_id === false)
    return { message: "Error ao validar usuario", status: false };

  if (data.id) {
    const produto = await prisma.produto_tag.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
      },
    });
    if (produto) {
      return { message: "Tag Editado Com Sucesso", status: true };
    }
    return { message: "Erro ao criar produto", status: false };
  } else {
    const produto = await prisma.produto_tag.create({
      data: data,
    });
    if (produto) {
      return { message: "Tag Cadastrado Com Sucesso", status: true };
    }

    return { message: "Erro ao criar produto", status: false };
  }
}

export async function getTagByid(id: string): Promise<Produto_tag | null> {
  const tag = await prisma.produto_tag.findFirst({
    where: {
      id,
    },
  });

  return tag;
}

export async function deleteTagByIds(ids: string[]): Promise<{
  message: string;
  status: boolean;
}> {
  try {
    const tag = await prisma.produto_tag.deleteMany({
      where: {
        id: {
          in: ids,
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
