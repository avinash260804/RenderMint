const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const disciplines = [
  { name: "Architecture", slug: "architecture" },
  { name: "Interior Design", slug: "interior-design" },
  { name: "Urban Design", slug: "urban-design" },
];

const architectureSoftwares = [
  { name: "Rhino", slug: "rhino" },
  { name: "Grasshopper", slug: "grasshopper" },
  { name: "Revit", slug: "revit" },
  { name: "AutoCAD", slug: "autocad" },
  { name: "SketchUp", slug: "sketchup" },
  { name: "Lumion", slug: "lumion" },
  { name: "Enscape", slug: "enscape" },
  { name: "V-Ray", slug: "v-ray" },
];

const baseTags = [
  { name: "Workflow", slug: "workflow" },
  { name: "Critique", slug: "critique" },
  { name: "Rendering", slug: "rendering" },
  { name: "Modeling", slug: "modeling" },
  { name: "Presentation", slug: "presentation" },
  { name: "Parametric", slug: "parametric" },
];

async function main() {
  for (const discipline of disciplines) {
    await prisma.discipline.upsert({
      where: { slug: discipline.slug },
      update: { name: discipline.name },
      create: discipline,
    });
  }

  const architecture = await prisma.discipline.findUniqueOrThrow({
    where: { slug: "architecture" },
    select: { id: true },
  });

  for (const software of architectureSoftwares) {
    await prisma.software.upsert({
      where: {
        disciplineId_slug: {
          disciplineId: architecture.id,
          slug: software.slug,
        },
      },
      update: { name: software.name },
      create: {
        name: software.name,
        slug: software.slug,
        disciplineId: architecture.id,
      },
    });
  }

  for (const tag of baseTags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
  }

  console.log("Seed complete: disciplines, softwares, and tags inserted.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
