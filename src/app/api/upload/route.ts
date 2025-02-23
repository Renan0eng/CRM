import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const fileName = `task-${Date.now()}.jpg`;
    const blob = await put(fileName, file, { access: "public" });

    return NextResponse.json({ url: blob.url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
};
