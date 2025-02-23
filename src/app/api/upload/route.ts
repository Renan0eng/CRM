import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

    const fileName = `task-${Date.now()}.webp`;
    const blob = await put(fileName, webpBuffer, { access: "public" });

    return NextResponse.json({ url: blob.url }, { status: 200 });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
};
