import { Prisma } from "@prisma/client";

const SOFT_DELETE_MODELS = new Set(["Post", "Comment"]);

function modelHasSoftDelete(model: string | undefined): boolean {
  return model !== undefined && SOFT_DELETE_MODELS.has(model);
}

function mergeDeletedAtNull(args: { where?: Record<string, unknown> }) {
  args.where = {
    ...args.where,
    deletedAt: null,
  };
}

export const softDeleteExtension = Prisma.defineExtension({
  name: "soft-delete",
  query: {
    $allModels: {
      async findMany({ model, args, query }) {
        if (modelHasSoftDelete(model)) {
          mergeDeletedAtNull(args as { where?: Record<string, unknown> });
        }

        return query(args);
      },
      async findFirst({ model, args, query }) {
        if (modelHasSoftDelete(model)) {
          mergeDeletedAtNull(args as { where?: Record<string, unknown> });
        }

        return query(args);
      },
      async count({ model, args, query }) {
        if (modelHasSoftDelete(model)) {
          mergeDeletedAtNull(args as { where?: Record<string, unknown> });
        }

        return query(args);
      },
      async aggregate({ model, args, query }) {
        if (modelHasSoftDelete(model)) {
          mergeDeletedAtNull(args as { where?: Record<string, unknown> });
        }

        return query(args);
      },
      async groupBy({ model, args, query }) {
        if (modelHasSoftDelete(model)) {
          mergeDeletedAtNull(args as { where?: Record<string, unknown> });
        }

        return query(args);
      },
    },
  },
});
