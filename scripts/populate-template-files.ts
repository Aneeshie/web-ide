import prisma from "../lib/db";
import { templatePaths } from "../lib/template";
import { scanTemplateDirectory } from "../features/playground/lib/path-to-json";
import path from "path";

async function main() {
  try {
    console.log("Fetching playgrounds without template files...");

    // Get all playgrounds that don't have template files
    const playgroundsWithoutFiles = await prisma.playground.findMany({
      where: {
        templateFiles: {
          none: {},
        },
      },
    });

    console.log(
      `Found ${playgroundsWithoutFiles.length} playgrounds without template files`
    );

    for (const playground of playgroundsWithoutFiles) {
      try {
        const templateKey = playground.template as keyof typeof templatePaths;
        const templatePath = templatePaths[templateKey];

        if (!templatePath) {
          console.warn(`Invalid template for playground ${playground.id}: ${templateKey}`);
          continue;
        }

        const inputPath = path.join(process.cwd(), templatePath);
        console.log(`Scanning template for ${playground.id} at ${inputPath}...`);

        const templateStructure = await scanTemplateDirectory(inputPath);

        // Create the template file
        await prisma.templateFile.create({
          data: {
            playgroundId: playground.id,
            content: templateStructure as any,
          },
        });

        console.log(`✓ Populated template for ${playground.title} (${playground.id})`);
      } catch (error) {
        console.error(
          `✗ Failed to populate template for ${playground.title} (${playground.id}):`,
          error
        );
      }
    }

    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
