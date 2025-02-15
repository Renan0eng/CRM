"use server";

import { createSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await getUserByEmailPassword(email, password);
    if (response?.token) {
      const cookieStore = await cookies();
      cookieStore.set("token", response.token);
      return response;
    }
    return response;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getUserByEmailPassword(
  formEmail: string,
  formPassword: string
) {
  const response = await prisma.user.findFirst({
    where: {
      email: formEmail,
    },
  });

  if (!response) return { message: "Credenciais Inválidas" };

  if (!response.active) return { message: "Usuario não ativado!" };

  const passwordMatch = await bcrypt.compare(formPassword, response.password);

  if (!passwordMatch) return { message: "Credenciais Inválidas" };

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("insira o JWT_SECRET no .env");
    return;
  }

  const token = await createSession(response, secret);

  const { password, ...user } = response;

  return { token, user };
}

type CreateUser = Omit<Prisma.UserCreateInput, "id">;

export async function createUser(data: CreateUser) {
  data.password = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data,
  });

  if (user) {
    return true;
  }
  return false;
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.delete("token");
}
