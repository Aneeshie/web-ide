import {
  scanTemplateDirectory,
} from "@/features/playground/lib/path-to-json";
import prisma from "@/lib/db";
import { templatePaths } from "@/lib/template";
import { NextRequest } from "next/server";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Missing Playground Id" }, { status: 400 });
  }

  const playground = await prisma.playground.findUnique({
    where: { id },
  });

  if (!playground) {
    return Response.json({ error: "Playground not found!" }, { status: 404 });
  }

  const templateKey = playground.template as keyof typeof templatePaths;
  const templatePath = templatePaths[templateKey];

  if (!templatePath) {
    return Response.json({ error: "Invalid template" }, { status: 404 });
  }

  try {
    const inputPath = path.join(process.cwd(), templatePath);
    console.log("[API] Scanning template at:", inputPath);
    
    const result = await scanTemplateDirectory(inputPath);
    console.log("[API] Template structure generated:", {
      folderName: result.folderName,
      itemCount: result.items.length,
    });

    return Response.json(
      { success: "true", templateJson: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Error generating template JSON:", error);
    return Response.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}
