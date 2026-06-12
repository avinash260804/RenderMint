# Sprint 10 Verification

## Purpose

Sprint 10 stabilizes the data-backed MVP foundation by replacing minimal seed data with realistic community content and documenting the verification gates for future work.

## Required Local Environment

- `DATABASE_URL` should point to the pooled runtime database URL.
- `DIRECT_URL` should point to the direct non-pooled database URL for Prisma migrations and seed safety.
- `SEED_DATABASE_URL` is optional and can override the seed connection if your direct database host is blocked locally.
- For Supabase pooler URLs, the runtime Prisma client and seed script keep connection usage low.

## Commands

Run after dependency install and database availability are confirmed:

```bash
npx prisma validate
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run typecheck
npm run build
```

For a quick code/build gate after the database is already prepared:

```bash
npm run verify
```

## Seed Coverage

The seed creates:

- disciplines
- softwares
- profiles
- profile software selections
- posts across discussion, critique, showcase, help, and resource
- comments
- accepted help solution state
- attachments
- tags and post tags
- votes
- counters and simple reputation totals

## Manual Smoke Checklist

- Home renders populated sections.
- Explore/search can find seeded posts.
- Discipline pages render seeded discipline content.
- Thread pages render comments.
- Help thread shows solved state for the seeded Grasshopper issue.
- Profile APIs return seeded user data.
