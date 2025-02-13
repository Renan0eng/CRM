"use server";

import prisma from "@/lib/db";

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
    const task = await prisma.task.create({
      data,
    });
    return task;
  }
}

export async function getColumns() {
  const columns = await prisma.column.findMany({
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

export async function createOrEditColumn(data: { name: string }) {
  const column = await prisma.column.create({
    data,
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
