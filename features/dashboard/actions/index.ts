"use server";

import { currentUser } from "@/features/auth/actions";
import prisma from "@/lib/db";
import { Templates } from "@/lib/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { templatePaths } from "@/lib/template";
import { scanTemplateDirectory } from "@/features/playground/lib/path-to-json";
import path from "path";

export const createPlayground = async (data: {
  title: string;
  template: Templates;
  description?: string;
}) => {
  const { template, title, description } = data;

  const user = await currentUser();

  if (!user) return null;
  if (!user.id) return null;

  try {
    let dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser && user.email) {
      dbUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name || undefined,
          image: user.image || undefined,
        },
      });
    }
    if (!dbUser) return null;

    // Get the template path
    const templateKey = template as keyof typeof templatePaths;
    const templatePath = templatePaths[templateKey];
    
    if (!templatePath) {
      throw new Error(`Invalid template: ${template}`);
    }

    // Generate template structure
    const inputPath = path.join(process.cwd(), templatePath);
    console.log("[createPlayground] Scanning template at:", inputPath);
    const templateStructure = await scanTemplateDirectory(inputPath);
    console.log("[createPlayground] Template structure generated:", {
      folderName: templateStructure.folderName,
      itemCount: templateStructure.items.length,
    });

    // Create playground with template files in a transaction
    const playground = await prisma.$transaction(async (tx) => {
      const newPlayground = await tx.playground.create({
        data: {
          title,
          description: description || "",
          template,
          user: { connect: { id: dbUser.id } },
        },
      });

      // Create the template file with the generated structure
      await tx.templateFile.create({
        data: {
          playgroundId: newPlayground.id,
          content: templateStructure,
        },
      });

      return newPlayground;
    });

    return playground;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllPlaygroundsByUser = async () => {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  try {
    const playground = await prisma.playground.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        starkMark: {
          where: {
            userId: user?.id,
          },
          select: {
            isMarked: true,
          },
        },
      },
    });

    return playground;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteProjectById = async (id: string) => {
  try {
    await prisma.playground.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const editProjectById = async (
  id: string,
  data: { title: string; description: string }
) => {
  try {
    await prisma.playground.update({
      where: { id },
      data: data,
    });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const duplicateProjectById = async (id: string) => {
  try {
    const original = await prisma.playground.findUnique({
      where: { id },
      include: {
        templateFiles: true,
      },
    });

    if (!original) {
      throw new Error("playground not found");
    }

    const duplicatedProject = await prisma.$transaction(async (tx) => {
      const newProject = await tx.playground.create({
        data: {
          title: `${original.title} (Copy)`,
          description: `${original.description}`,
          template: original.template,
          userId: original.userId,
        },
      });

      // Copy template files if they exist
      if (original.templateFiles && original.templateFiles.length > 0) {
        await tx.templateFile.create({
          data: {
            playgroundId: newProject.id,
            content: original.templateFiles[0].content,
          },
        });
      }

      return newProject;
    });

    revalidatePath("/dashboard");

    return duplicatedProject;
  } catch (error) {
    console.error(error);
    return null;
  }
};
