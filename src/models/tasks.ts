"use server";

import { getUserId } from "@/lib/auth";
import prisma from "@/lib/db";
import { error } from "console";

export async function createOrEdit(data: CreateOrEditTask) {
  console.log("data", data);

  if (data.id) {
    const task = await prisma.task.update({
      data,
      where: {
        id: data.id,
      },
    });
    return task;
  } else {
    const user_create_id = await getUserId();

    if (!user_create_id) return { message: "error ao buscar usuario" };

    const task = await prisma.task.create({
      data: {
        ...data,
        user_create_id,
      },
    });
    return task;
  }
}

export async function getColumns() {
  const user_id = await getUserId();

  if (!user_id) return { message: "error ao buscar usuario" };

  const columns = await prisma.column.findMany({
    where: {
      user_create_id: user_id,
    },
    orderBy: {
      index: "asc",
    },
    include: {
      tasks: {
        orderBy: {
          index: "asc",
        },
      },
    },
  });

  return columns;
}

export async function createOrEditColumn(data: {
  name: string;
  index?: number;
  id?: string;
}) {
  if (data.id) {
    const column = await prisma.column.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
      },
      include: {
        tasks: true,
      },
    });

    return column;
  }
  const lastColumn = await prisma.column.findFirst({
    orderBy: {
      index: "desc",
    },
  });

  const user_create_id = await getUserId();

  if (!user_create_id) return { message: "error ao buscar usuario" };

  const column = await prisma.column.create({
    data: {
      ...data,
      user_create_id,
      index: lastColumn ? lastColumn?.index + 1 : 0,
    },
    include: {
      tasks: true,
    },
  });

  return column;
}

export async function deleteTask(id: string) {
  const task = await prisma.task.delete({
    where: {
      id,
    },
  });
}

export async function deleteColumnById(id: string) {
  await prisma.task.deleteMany({
    where: { column_id: id },
  });

  await prisma.column.delete({
    where: { id },
  });
}
