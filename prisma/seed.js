const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getSeedDatabaseUrl(),
    },
  },
});

const disciplines = [
  { name: "Architecture", slug: "architecture" },
  { name: "Interior Design", slug: "interior-design" },
  { name: "Urban Design", slug: "urban-design" },
];

const softwareByDiscipline = {
  architecture: ["Rhino", "Grasshopper", "Revit", "AutoCAD", "SketchUp", "Lumion", "Enscape", "V-Ray"],
  "interior-design": ["SketchUp", "AutoCAD", "V-Ray", "Enscape"],
  "urban-design": ["AutoCAD", "Rhino", "Grasshopper", "SketchUp"],
};

const profiles = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    username: "anaya-studio",
    bio: "Architecture student exploring climate-responsive studios and presentation workflows.",
    primaryDiscipline: "architecture",
    softwares: ["rhino", "grasshopper", "enscape"],
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    username: "ravi-renders",
    bio: "Visualization generalist focused on fast iteration, lighting studies, and critique loops.",
    primaryDiscipline: "architecture",
    softwares: ["revit", "lumion", "v-ray"],
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    username: "meera-spaces",
    bio: "Interior designer documenting material systems, client presentations, and detail workflows.",
    primaryDiscipline: "interior-design",
    softwares: ["sketchup", "autocad", "v-ray"],
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    username: "kabir-urbanlab",
    bio: "Urban design researcher working on mobility, public realm, and diagram-heavy storytelling.",
    primaryDiscipline: "urban-design",
    softwares: ["autocad", "rhino", "grasshopper"],
  },
];

const tags = [
  "Workflow",
  "Critique",
  "Rendering",
  "Modeling",
  "Presentation",
  "Parametric",
  "Portfolio",
  "Studio",
  "Troubleshooting",
  "Resources",
  "Materiality",
  "Urban Analysis",
].map((name) => ({ name, slug: slugify(name) }));

const posts = [
  {
    id: "aaaaaaaa-0001-4000-8000-000000000001",
    slug: "best-workflow-architecture-presentations-2026",
    title: "Best workflow for architecture presentations in 2026?",
    postType: "discussion",
    authorUsername: "anaya-studio",
    disciplineSlug: "architecture",
    softwareSlug: "rhino",
    body: "How are you moving from model to diagrams to final boards without losing time near deadlines?",
    tags: ["workflow", "presentation", "studio"],
    viewCount: 146,
  },
  {
    id: "aaaaaaaa-0002-4000-8000-000000000002",
    slug: "massing-options-for-climate-studio-critique",
    title: "Which massing option works better for this climate studio?",
    postType: "critique",
    authorUsername: "anaya-studio",
    disciplineSlug: "architecture",
    softwareSlug: "grasshopper",
    body: "The brief asks for shaded terraces and a compact envelope. I need feedback on the parti clarity.",
    context: "Semester 6 design studio in Pune with a mixed-use public program.",
    projectDescription: "Two early massing options for a climate-responsive learning center.",
    challengeStatement: "Balance daylight, shaded outdoor space, and a legible massing argument.",
    feedbackRequested: "Please focus on massing clarity, open-space logic, and diagram communication.",
    tags: ["critique", "parametric", "presentation"],
    viewCount: 213,
  },
  {
    id: "aaaaaaaa-0003-4000-8000-000000000003",
    slug: "monsoon-house-courtyard-showcase",
    title: "Monsoon House courtyard study",
    postType: "showcase",
    authorUsername: "ravi-renders",
    disciplineSlug: "architecture",
    softwareSlug: "enscape",
    body: "A compact courtyard housing exploration focused on rain, shaded thresholds, and warm interiors.",
    projectSummary: "A finished visualization set for a monsoon-responsive courtyard house.",
    toolsUsed: ["Revit", "Enscape", "Photoshop"],
    projectLink: "https://example.com/monsoon-house",
    tags: ["rendering", "portfolio", "materiality"],
    viewCount: 342,
  },
  {
    id: "aaaaaaaa-0004-4000-8000-000000000004",
    slug: "rhino-file-freezes-when-opening-grasshopper-panels",
    title: "Rhino file freezes when opening Grasshopper panels",
    postType: "help",
    authorUsername: "kabir-urbanlab",
    disciplineSlug: "architecture",
    softwareSlug: "grasshopper",
    body: "The model opens, but the moment I open the Grasshopper definition the viewport freezes.",
    issueDescription: "Rhino stays responsive until the Grasshopper canvas opens, then CPU spikes.",
    errorContext: "Rhino 8 on Windows, workshop definition, Ladybug plus missing plugin components.",
    tags: ["troubleshooting", "parametric", "modeling"],
    viewCount: 517,
  },
  {
    id: "aaaaaaaa-0005-4000-8000-000000000005",
    slug: "presentation-resource-pack-for-first-year-studio",
    title: "Presentation resource pack for first-year studio boards",
    postType: "resource",
    authorUsername: "meera-spaces",
    disciplineSlug: "architecture",
    softwareSlug: "autocad",
    body: "A starter pack for clean boards: line-weight reminders, title hierarchy, and review checklist.",
    resourceExplanation: "Use this as a pre-final review checklist before exporting boards.",
    resourceLinks: [{ label: "Board hierarchy checklist", url: "https://example.com/board-checklist" }],
    tags: ["resources", "presentation", "studio"],
    viewCount: 289,
  },
  {
    id: "aaaaaaaa-0006-4000-8000-000000000006",
    slug: "client-friendly-material-palette-workflow",
    title: "How do you present material palettes to non-design clients?",
    postType: "discussion",
    authorUsername: "meera-spaces",
    disciplineSlug: "interior-design",
    softwareSlug: "sketchup",
    body: "What has worked for explaining material tradeoffs without overwhelming clients?",
    tags: ["workflow", "materiality", "presentation"],
    viewCount: 134,
  },
  {
    id: "aaaaaaaa-0007-4000-8000-000000000007",
    slug: "neighbourhood-mobility-diagram-feedback",
    title: "Feedback on neighbourhood mobility diagrams",
    postType: "critique",
    authorUsername: "kabir-urbanlab",
    disciplineSlug: "urban-design",
    softwareSlug: "autocad",
    body: "The current diagram set feels too technical for a public consultation board.",
    context: "Community consultation package for a transit-adjacent neighbourhood plan.",
    projectDescription: "Mobility-first masterplan diagram set.",
    challengeStatement: "Make movement hierarchy legible without losing nuance.",
    feedbackRequested: "Please comment on diagram sequencing, annotation density, and color coding.",
    tags: ["critique", "urban-analysis", "presentation"],
    viewCount: 198,
  },
  {
    id: "aaaaaaaa-0008-4000-8000-000000000008",
    slug: "vray-materials-render-too-dark-in-interior-scene",
    title: "V-Ray materials render too dark in interior scene",
    postType: "help",
    authorUsername: "meera-spaces",
    disciplineSlug: "interior-design",
    softwareSlug: "v-ray",
    body: "My preview looks balanced, but final renders make walnut, terracotta, and fabric swatches almost black.",
    issueDescription: "Interior scene renders significantly darker than viewport/material preview.",
    errorContext: "SketchUp + V-Ray, physical camera enabled, ACES color mapping, HDRI and rectangular lights.",
    tags: ["troubleshooting", "rendering", "materiality"],
    viewCount: 421,
  },
];

const comments = [
  ["bbbbbbbb-0001-4000-8000-000000000001", "best-workflow-architecture-presentations-2026", "ravi-renders", "Keep the model as source of truth and only polish layout once section/grid logic is locked."],
  ["bbbbbbbb-0002-4000-8000-000000000002", "best-workflow-architecture-presentations-2026", "kabir-urbanlab", "Make a tiny export matrix before drawing: base, movement, program, ecology, annotation."],
  ["bbbbbbbb-0003-4000-8000-000000000003", "massing-options-for-climate-studio-critique", "meera-spaces", "The courtyard split reads stronger because it gives you a clear environmental argument."],
  ["bbbbbbbb-0004-4000-8000-000000000004", "massing-options-for-climate-studio-critique", "ravi-renders", "Try showing the same sun-path overlay on both options so the comparison feels fair."],
  ["bbbbbbbb-0005-4000-8000-000000000005", "rhino-file-freezes-when-opening-grasshopper-panels", "anaya-studio", "Open Grasshopper first, disable the solver, relink referenced geometry, remove missing plugin components, then enable the solver.", true],
  ["bbbbbbbb-0006-4000-8000-000000000006", "rhino-file-freezes-when-opening-grasshopper-panels", "ravi-renders", "Check if preview is enabled on heavy mesh components; old workshop files can freeze from preview alone."],
  ["bbbbbbbb-0007-4000-8000-000000000007", "neighbourhood-mobility-diagram-feedback", "anaya-studio", "Split conflict points into a second diagram. Public boards work better when each diagram has one question."],
  ["bbbbbbbb-0008-4000-8000-000000000008", "vray-materials-render-too-dark-in-interior-scene", "ravi-renders", "Disable physical camera exposure and test a neutral clay render first."],
].map(([id, postSlug, authorUsername, body, isSolution = false]) => ({
  id,
  postSlug,
  authorUsername,
  body,
  isSolution,
}));

const attachments = [
  ["cccccccc-0001-4000-8000-000000000001", "massing-options-for-climate-studio-critique", "seed/critique/massing-options.webp"],
  ["cccccccc-0002-4000-8000-000000000002", "monsoon-house-courtyard-showcase", "seed/showcase/monsoon-house.webp"],
  ["cccccccc-0003-4000-8000-000000000003", "rhino-file-freezes-when-opening-grasshopper-panels", "seed/help/grasshopper-freeze.webp"],
].map(([id, postSlug, key]) => ({
  id,
  postSlug,
  key,
  url: `https://example.com/${key}`,
  mimeType: "image/webp",
  size: BigInt(245760),
}));

const votes = [
  ["dddddddd-0001-4000-8000-000000000001", "ravi-renders", "post", "best-workflow-architecture-presentations-2026"],
  ["dddddddd-0002-4000-8000-000000000002", "meera-spaces", "post", "best-workflow-architecture-presentations-2026"],
  ["dddddddd-0003-4000-8000-000000000003", "kabir-urbanlab", "post", "massing-options-for-climate-studio-critique"],
  ["dddddddd-0004-4000-8000-000000000004", "anaya-studio", "post", "monsoon-house-courtyard-showcase"],
  ["dddddddd-0005-4000-8000-000000000005", "meera-spaces", "post", "rhino-file-freezes-when-opening-grasshopper-panels"],
  ["dddddddd-0006-4000-8000-000000000006", "kabir-urbanlab", "comment", "bbbbbbbb-0005-4000-8000-000000000005"],
  ["dddddddd-0007-4000-8000-000000000007", "meera-spaces", "comment", "bbbbbbbb-0005-4000-8000-000000000005"],
  ["dddddddd-0008-4000-8000-000000000008", "anaya-studio", "comment", "bbbbbbbb-0008-4000-8000-000000000008"],
];

async function main() {
  const disciplineBySlug = new Map();
  const softwareByKey = new Map();
  const profileByUsername = new Map();
  const tagBySlug = new Map();
  const postBySlug = new Map();

  for (const discipline of disciplines) {
    const record = await prisma.discipline.upsert({
      where: { slug: discipline.slug },
      update: { name: discipline.name },
      create: discipline,
    });
    disciplineBySlug.set(record.slug, record);
  }

  for (const [disciplineSlug, names] of Object.entries(softwareByDiscipline)) {
    const discipline = disciplineBySlug.get(disciplineSlug);
    for (const name of names) {
      const slug = slugify(name);
      const record = await prisma.software.upsert({
        where: { disciplineId_slug: { disciplineId: discipline.id, slug } },
        update: { name },
        create: { name, slug, disciplineId: discipline.id },
      });
      softwareByKey.set(`${disciplineSlug}:${slug}`, record);
    }
  }

  for (const tag of tags) {
    const record = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
    tagBySlug.set(record.slug, record);
  }

  for (const profile of profiles) {
    const record = await prisma.profile.upsert({
      where: { username: profile.username },
      update: {
        username: profile.username,
        bio: profile.bio,
        primaryDiscipline: profile.primaryDiscipline,
        avatarUrl: `https://api.dicebear.com/9.x/shapes/svg?seed=${profile.username}`,
      },
      create: {
        id: profile.id,
        username: profile.username,
        bio: profile.bio,
        primaryDiscipline: profile.primaryDiscipline,
        avatarUrl: `https://api.dicebear.com/9.x/shapes/svg?seed=${profile.username}`,
      },
    });
    profileByUsername.set(record.username, record);

    for (const softwareSlug of profile.softwares) {
      const software = softwareByKey.get(`${profile.primaryDiscipline}:${softwareSlug}`);
      if (!software) continue;
      await prisma.profileSoftware.upsert({
        where: { profileId_softwareId: { profileId: record.id, softwareId: software.id } },
        update: {},
        create: { profileId: record.id, softwareId: software.id },
      });
    }
  }

  for (const post of posts) {
    const author = profileByUsername.get(post.authorUsername);
    const discipline = disciplineBySlug.get(post.disciplineSlug);
    const software = softwareByKey.get(`${post.disciplineSlug}:${post.softwareSlug}`);
    const data = buildPostData(post, author, discipline, software);
    const record = await prisma.post.upsert({
      where: { slug: post.slug },
      update: data,
      create: { id: post.id, ...data },
    });
    postBySlug.set(record.slug, record);

    for (const tagSlug of post.tags) {
      const tag = tagBySlug.get(tagSlug);
      if (!tag) continue;
      await prisma.postTag.upsert({
        where: { postId_tagId: { postId: record.id, tagId: tag.id } },
        update: {},
        create: { postId: record.id, tagId: tag.id },
      });
    }
  }

  for (const comment of comments) {
    const post = postBySlug.get(comment.postSlug);
    const author = profileByUsername.get(comment.authorUsername);
    await prisma.comment.upsert({
      where: { id: comment.id },
      update: {
        postId: post.id,
        authorId: author.id,
        body: comment.body,
        isSolution: Boolean(comment.isSolution),
        deletedAt: null,
      },
      create: {
        id: comment.id,
        postId: post.id,
        authorId: author.id,
        body: comment.body,
        isSolution: Boolean(comment.isSolution),
      },
    });
  }

  for (const attachment of attachments) {
    const post = postBySlug.get(attachment.postSlug);
    await prisma.attachment.upsert({
      where: { id: attachment.id },
      update: { postId: post.id, key: attachment.key, url: attachment.url, mimeType: attachment.mimeType, size: attachment.size },
      create: { id: attachment.id, postId: post.id, key: attachment.key, url: attachment.url, mimeType: attachment.mimeType, size: attachment.size },
    });
  }

  for (const [id, authorUsername, targetType, targetId] of votes) {
    const author = profileByUsername.get(authorUsername);
    const post = targetType === "post" ? postBySlug.get(targetId) : null;
    await prisma.vote.upsert({
      where: { id },
      update: {
        authorId: author.id,
        targetType,
        postId: post?.id ?? null,
        commentId: targetType === "comment" ? targetId : null,
        voteType: "up",
      },
      create: {
        id,
        authorId: author.id,
        targetType,
        postId: post?.id ?? null,
        commentId: targetType === "comment" ? targetId : null,
        voteType: "up",
      },
    });
  }

  await applyAcceptedSolutions(postBySlug);
  await refreshCountersAndReputation();

  console.log(
    `Seed complete: ${disciplines.length} disciplines, ${profiles.length} profiles, ${posts.length} posts, ${comments.length} comments, ${tags.length} tags, ${votes.length} votes.`,
  );
}

function buildPostData(post, author, discipline, software) {
  return {
    slug: post.slug,
    title: post.title,
    body: post.body,
    postType: post.postType,
    authorId: author.id,
    disciplineId: discipline.id,
    softwareId: software?.id ?? null,
    context: post.context ?? null,
    projectDescription: post.projectDescription ?? null,
    challengeStatement: post.challengeStatement ?? null,
    feedbackRequested: post.feedbackRequested ?? null,
    projectSummary: post.projectSummary ?? null,
    toolsUsed: post.toolsUsed ?? undefined,
    projectLink: post.projectLink ?? null,
    issueDescription: post.issueDescription ?? null,
    errorContext: post.errorContext ?? null,
    resourceExplanation: post.resourceExplanation ?? null,
    resourceLinks: post.resourceLinks ?? undefined,
    viewCount: post.viewCount ?? 0,
    isSolved: false,
    acceptedCommentId: null,
    deletedAt: null,
  };
}

async function applyAcceptedSolutions(postBySlug) {
  const solvedHelpPost = postBySlug.get("rhino-file-freezes-when-opening-grasshopper-panels");
  await prisma.post.update({
    where: { id: solvedHelpPost.id },
    data: {
      isSolved: true,
      acceptedCommentId: "bbbbbbbb-0005-4000-8000-000000000005",
    },
  });
}

async function refreshCountersAndReputation() {
  const allPosts = await prisma.post.findMany({ select: { id: true } });
  for (const post of allPosts) {
    const [commentCount, votesForPost] = await Promise.all([
      prisma.comment.count({ where: { postId: post.id, deletedAt: null } }),
      prisma.vote.findMany({ where: { postId: post.id }, select: { voteType: true } }),
    ]);
    await prisma.post.update({
      where: { id: post.id },
      data: { commentCount, voteCount: scoreVotes(votesForPost) },
    });
  }

  const allComments = await prisma.comment.findMany({ select: { id: true } });
  for (const comment of allComments) {
    const votesForComment = await prisma.vote.findMany({
      where: { commentId: comment.id },
      select: { voteType: true },
    });
    await prisma.comment.update({
      where: { id: comment.id },
      data: { voteCount: scoreVotes(votesForComment) },
    });
  }

  const allProfiles = await prisma.profile.findMany({ select: { id: true } });
  for (const profile of allProfiles) {
    const [acceptedAnswers, critiqueContributions, commentUpvotes, postUpvotes, discussionPosts, discussionComments] =
      await Promise.all([
        prisma.comment.count({ where: { authorId: profile.id, deletedAt: null, isSolution: true } }),
        prisma.comment.count({
          where: { authorId: profile.id, deletedAt: null, post: { postType: "critique", deletedAt: null } },
        }),
        prisma.vote.count({
          where: { targetType: "comment", voteType: "up", comment: { authorId: profile.id, deletedAt: null } },
        }),
        prisma.vote.count({
          where: { targetType: "post", voteType: "up", post: { authorId: profile.id, deletedAt: null } },
        }),
        prisma.post.count({ where: { authorId: profile.id, deletedAt: null, postType: "discussion" } }),
        prisma.comment.count({
          where: { authorId: profile.id, deletedAt: null, post: { postType: "discussion", deletedAt: null } },
        }),
      ]);

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        reputation:
          acceptedAnswers * 5 +
          critiqueContributions * 3 +
          commentUpvotes * 2 +
          postUpvotes * 2 +
          discussionPosts +
          discussionComments,
      },
    });
  }
}

function scoreVotes(votesForTarget) {
  return votesForTarget.reduce((score, vote) => score + (vote.voteType === "up" ? 1 : -1), 0);
}

function getSeedDatabaseUrl() {
  const databaseUrl = process.env.SEED_DATABASE_URL || process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!databaseUrl) return undefined;

  try {
    const url = new URL(databaseUrl);
    if (url.hostname.toLowerCase().includes("pooler.supabase.com")) {
      url.searchParams.set("pgbouncer", "true");
      url.searchParams.set("connection_limit", "1");
      url.searchParams.set("pool_timeout", "20");
    }
    return url.toString();
  } catch {
    return databaseUrl;
  }
}

function slugify(value) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
