"use server";

import prisma from "@/lib/db";
import { TemplateFolder } from "../lib/path-to-json";
import { currentUser } from "@/features/auth/actions";
import { Prisma } from "@/lib/generated/prisma/client";

export const getPlaygroundById = async (id: string) => {
  try {
    const pg = await prisma.playground.findUnique({
      where: { id },
      select: {
        title: true,
        description: true,
        templateFiles: {
          select: {
            content: true,
          },
        },
      },
    });

    return pg;
  } catch (error) {
    console.log(error);
  }
};

export const saveUpdatedCode = async (id: string, data: TemplateFolder) => {
  const user = await currentUser();

  if (!user) return null;

  try {
    const updatedPlayground = await prisma.templateFile.upsert({
      where: { playgroundId: id },
      update: {
        content: JSON.stringify(data),
      },
      create: {
        playgroundId: id,
        content: JSON.stringify(data),
      },
    });
    return updatedPlayground;
  } catch (error) {}
};
