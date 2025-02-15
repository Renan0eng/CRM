import { NextRequest, NextResponse } from "next/server";
import { getUserId, verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  const isAdminRoute = path.startsWith("/admin");
  if (isAdminRoute) {
    const token = request.cookies.get("token")?.value;

    if (!token)
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${path}`, request.url)
      );
    const verifiedToken = await verifyToken(token);

    if (!verifiedToken) {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${path}`, request.url)
      );
    }
  }

  return NextResponse.next();
}
