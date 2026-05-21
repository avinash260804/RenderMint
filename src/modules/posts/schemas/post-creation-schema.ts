import { z } from "zod";
import { uploadedAssetSchema } from "@/modules/uploads/schemas/upload-schema";

export const postTypeSchema = z.enum(["discussion", "critique", "showcase", "help", "resource"]);

const baseSchema = z.object({
  postType: postTypeSchema,
  title: z.string().trim().min(8, "Title must be at least 8 characters.").max(180),
  discipline: z.string().trim().min(1, "Discipline is required."),
  software: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  body: z.string().trim().optional(),
  context: z.string().trim().optional(),
  projectDescription: z.string().trim().optional(),
  challengeStatement: z.string().trim().optional(),
  feedbackRequested: z.string().trim().optional(),
  projectSummary: z.string().trim().optional(),
  toolsUsed: z.string().trim().optional(),
  projectLink: z.string().trim().optional(),
  issueDescription: z.string().trim().optional(),
  errorContext: z.string().trim().optional(),
  resourceExplanation: z.string().trim().optional(),
  resourceLinks: z.string().trim().optional(),
  attachments: z.array(uploadedAssetSchema).max(12).default([]),
});

export const postCreationSchema = baseSchema.superRefine((value, ctx) => {
  if (value.postType === "discussion") {
    if (!value.body || value.body.length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "Discussion body must be at least 20 characters.",
      });
    }
  }

  if (value.postType === "critique") {
    if (!value.context) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["context"],
        message: "Context is required.",
      });
    }
    if (!value.projectDescription || value.projectDescription.length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["projectDescription"],
        message: "Project description must be at least 20 characters.",
      });
    }
    if (!value.challengeStatement || value.challengeStatement.length < 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["challengeStatement"],
        message: "Challenge statement must be at least 12 characters.",
      });
    }
    if (value.attachments.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["attachments"],
        message: "At least one reference image is required for critique posts.",
      });
    }
  }

  if (value.postType === "showcase") {
    if (!value.projectSummary || value.projectSummary.length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["projectSummary"],
        message: "Project summary must be at least 20 characters.",
      });
    }
    if (!value.toolsUsed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toolsUsed"],
        message: "Tools used is required.",
      });
    }
    if (value.projectLink) {
      const urlCheck = z.string().url().safeParse(value.projectLink);
      if (!urlCheck.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["projectLink"],
          message: "Project link must be a valid URL.",
        });
      }
    }
    if (value.attachments.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["attachments"],
        message: "Showcase posts need at least one image.",
      });
    }
  }

  if (value.postType === "help") {
    if (!value.issueDescription || value.issueDescription.length < 16) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["issueDescription"],
        message: "Issue description must be at least 16 characters.",
      });
    }
    if (!value.software) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["software"],
        message: "Software is required for help posts.",
      });
    }
    if (value.attachments.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["attachments"],
        message: "Help posts require at least one screenshot.",
      });
    }
  }

  if (value.postType === "resource") {
    if (!value.resourceExplanation || value.resourceExplanation.length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["resourceExplanation"],
        message: "Resource explanation must be at least 20 characters.",
      });
    }

    if (value.resourceLinks) {
      const links = value.resourceLinks
        .split(/\n|,/)
        .map((entry) => entry.trim())
        .filter(Boolean);

      const invalidLink = links.find((link) => !z.string().url().safeParse(link).success);
      if (invalidLink) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["resourceLinks"],
          message: `Invalid URL: ${invalidLink}`,
        });
      }
    }
  }
});

export type PostCreationInput = z.input<typeof postCreationSchema>;
export type PostCreationValidated = z.output<typeof postCreationSchema>;

export const postCreationDefaultValues: PostCreationInput = {
  postType: "discussion",
  title: "",
  discipline: "architecture",
  software: "",
  tags: "",
  body: "",
  context: "",
  projectDescription: "",
  challengeStatement: "",
  feedbackRequested: "",
  projectSummary: "",
  toolsUsed: "",
  projectLink: "",
  issueDescription: "",
  errorContext: "",
  resourceExplanation: "",
  resourceLinks: "",
  attachments: [],
};
