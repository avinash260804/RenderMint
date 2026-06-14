export type DisciplineSlug = "architecture" | "interior-design" | "urban-design";
export type CommunityPostType = "discussion" | "critique" | "showcase" | "help" | "resource";

export type CommunityPost = {
  id: string;
  slug: string;
  discipline: DisciplineSlug;
  type: CommunityPostType;
  title: string;
  author: string;
  bodyPreview?: string;
  createdAt: string;
  tags?: string[];
  replyCount?: number;
  engagement?: string;
  feedbackRequested?: string;
  iterationCount?: number;
  creator?: string;
  tools?: string[];
  software?: string;
  solved?: boolean;
  answerCount?: number;
  resourceType?: string;
};

export type DisciplineData = {
  slug: DisciplineSlug;
  name: string;
  description: string;
  softwares: string[];
  trendingTags: string[];
};

export const communityCatalogDisciplines: DisciplineData[] = [
  {
    slug: "architecture",
    name: "Architecture",
    description: "Spatial design, technical execution, and presentation workflows.",
    softwares: ["Rhino", "Grasshopper", "Revit", "AutoCAD", "SketchUp"],
    trendingTags: ["massing", "facade", "presentation", "rendering"],
  },
  {
    slug: "interior-design",
    name: "Interior Design",
    description: "Interior concepts, detailing, visualization, and material systems.",
    softwares: ["SketchUp", "V-Ray", "AutoCAD", "Enscape"],
    trendingTags: ["lighting", "materials", "joinery", "detailing"],
  },
  {
    slug: "urban-design",
    name: "Urban Design",
    description: "Urban systems, public space, mobility, and development frameworks.",
    softwares: ["Rhino", "GIS", "Illustrator"],
    trendingTags: ["mobility", "public-realm", "climate", "masterplan"],
  },
];

export const communityCatalogPosts: CommunityPost[] = [
  {
    id: "d1",
    slug: "best-workflow-architecture-presentations-2026",
    discipline: "architecture",
    type: "discussion",
    title: "Best workflow for architecture presentations in 2026?",
    author: "Aditi S",
    bodyPreview:
      "Looking for a reliable studio-to-jury workflow for diagrams, renders, and final layout sequencing.",
    createdAt: "2026-05-01T08:00:00.000Z",
    tags: ["workflow", "presentation", "studio-culture"],
    replyCount: 28,
    engagement: "High engagement",
  },
  {
    id: "c1",
    slug: "massing-option-comparison-riverfront-cultural-center",
    discipline: "architecture",
    type: "critique",
    title: "Massing option comparison for riverfront cultural center",
    author: "Arjun M",
    bodyPreview:
      "Comparing two massing strategies with different public access and shadow behavior.",
    createdAt: "2026-05-02T12:30:00.000Z",
    feedbackRequested: "Facade rhythm and entry sequencing",
    iterationCount: 4,
  },
  {
    id: "s1",
    slug: "parametric-housing-cluster-climate-responsive-shading",
    discipline: "architecture",
    type: "showcase",
    title: "Parametric housing cluster with climate-responsive shading",
    author: "Nivedita R",
    bodyPreview:
      "A completed showcase of adaptive facade logic and daylight-optimized cluster planning.",
    createdAt: "2026-05-03T09:15:00.000Z",
    creator: "Nivedita R",
    tools: ["Rhino", "Grasshopper", "V-Ray"],
  },
  {
    id: "h1",
    slug: "revit-family-constraints-break-during-nested-load",
    discipline: "architecture",
    type: "help",
    title: "Revit family constraints break during nested load",
    author: "Karan P",
    bodyPreview:
      "Nested family constraints fail after reload. Need robust steps to prevent parameter corruption.",
    createdAt: "2026-05-03T15:45:00.000Z",
    software: "Revit",
    solved: true,
    answerCount: 7,
  },
  {
    id: "r1",
    slug: "rhino-to-lumion-export-checklist-clean-materials",
    discipline: "architecture",
    type: "resource",
    title: "Rhino to Lumion export checklist for clean materials",
    author: "Megha N",
    bodyPreview:
      "Practical export checklist to avoid UV, normals, and material name issues in Lumion.",
    createdAt: "2026-05-04T10:10:00.000Z",
    resourceType: "Guide",
    software: "Rhino",
  },
  {
    id: "d2",
    slug: "present-material-palettes-to-non-design-clients",
    discipline: "interior-design",
    type: "discussion",
    title: "How do you present material palettes to non-design clients?",
    author: "Ira V",
    bodyPreview:
      "Methods to translate technical finishes into understandable stories for client meetings.",
    createdAt: "2026-05-04T16:20:00.000Z",
    tags: ["materials", "client-presentation"],
    replyCount: 13,
    engagement: "Steady replies",
  },
  {
    id: "h2",
    slug: "v-ray-denoiser-causing-texture-blur-close-up-renders",
    discipline: "interior-design",
    type: "help",
    title: "V-Ray denoiser causing texture blur in close-up renders",
    author: "Rhea J",
    bodyPreview:
      "Need help retaining texture sharpness while using denoiser in interior close-up shots.",
    createdAt: "2026-05-05T11:50:00.000Z",
    software: "V-Ray",
    solved: false,
    answerCount: 2,
  },
  {
    id: "d3",
    slug: "communicate-mobility-first-masterplans-clearly",
    discipline: "urban-design",
    type: "discussion",
    title: "Best way to communicate mobility-first masterplans",
    author: "Sanket D",
    bodyPreview:
      "Looking for a high-clarity narrative structure for street hierarchy and pedestrian priority.",
    createdAt: "2026-05-06T14:40:00.000Z",
    tags: ["mobility", "masterplan", "diagramming"],
    replyCount: 19,
    engagement: "Trending",
  },
  {
    id: "r2",
    slug: "public-realm-section-library-early-stage-proposals",
    discipline: "urban-design",
    type: "resource",
    title: "Public realm section library for early-stage proposals",
    author: "Farah L",
    bodyPreview:
      "A compact section reference library for public-realm concepts at competition stage.",
    createdAt: "2026-05-07T09:05:00.000Z",
    resourceType: "Template Pack",
    software: "Rhino",
  },
];

export function getCommunityDisciplineBySlug(slug: string) {
  return communityCatalogDisciplines.find((discipline) => discipline.slug === slug);
}

export function getCommunityPostsByDiscipline(slug: DisciplineSlug) {
  return communityCatalogPosts.filter((post) => post.discipline === slug);
}

export function getCommunityPostsByType(type: CommunityPostType, slug?: DisciplineSlug) {
  return communityCatalogPosts.filter(
    (post) => post.type === type && (!slug || post.discipline === slug),
  );
}

export function getCommunityHomeSections() {
  return {
    trendingDiscussions: getCommunityPostsByType("discussion"),
    critiqueRequests: getCommunityPostsByType("critique"),
    featuredShowcases: getCommunityPostsByType("showcase"),
    solvedHelp: communityCatalogPosts.filter((post) => post.type === "help" && post.solved),
    weeklyResources: getCommunityPostsByType("resource"),
  };
}

export function getCommunityPostBySlug(slug: string) {
  return communityCatalogPosts.find((post) => post.slug === slug);
}
