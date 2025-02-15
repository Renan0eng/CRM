import { User } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export async function createSession(user: User, secret: string) {
  // Codifica a chave secreta para uso no JWT
  const secretKey = new TextEncoder().encode(secret);

  // Cria o token JWT
  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" }) // Define o algoritmo de assinatura
    .setIssuedAt() // Define o tempo de emissão
    .setExpirationTime("12h") // Define a expiração para 12 h
    .sign(secretKey); // Assina o token com a chave secreta

  return token;
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("JWT validation failed:", error);
    return null;
  }
}

export async function getUserId() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token?.value) return false;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token.value, secret);

  console.log("payload: ", payload);

  return payload.userId as string;
}
