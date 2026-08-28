---
type: moc
status: active
area:
  - security
  - qa
  - launch
priority: high
created: 2026-06-26
updated: 2026-06-26
---

# Security Map

This map connects all launch-readiness, app safety, Supabase, upload, user-generated content, admin, and QA security notes.

## Main Security Notes

- [[Security Checklist]]
- [[Launch Readiness]]
- [[Security Research]]
- [[CleanUtils Security Checklist Notes]]
- [[QA Test Plan]]

## Auth and Access

- [[Auth Flow]]
- [[Supabase Auth]]
- [[Auth Redirect Checks]]
- [[Session Handling]]
- [[Admin Route Protection]]
- [[Role Based Access]]
- [[Settings Access]]

## Supabase and Database

- [[Supabase RLS]]
- [[RLS Policy Checklist]]
- [[Service Role Key Protection]]
- [[Prisma Supabase Boundaries]]
- [[Database Permissions]]
- [[Data Exposure Risks]]

## Uploads and User Content

- [[Upload Security]]
- [[File Validation]]
- [[Image Upload Safety]]
- [[User-Generated Content Safety]]
- [[XSS Prevention]]
- [[Content Sanitization]]
- [[Spam Prevention]]

## Forms and API Safety

- [[Form Validation]]
- [[Rate Limiting]]
- [[API Error Handling]]
- [[Error Leakage Prevention]]
- [[Server Actions Safety]]
- [[Input Validation]]

## Moderation and Admin

- [[Admin System]]
- [[Admin Moderation Zone]]
- [[Post Moderation]]
- [[Reported Content Placeholder]]
- [[User Management Basic]]
- [[Audit Logs Future]]

## QA Checks

- [[Manual Testing Checklist]]
- [[TesterArmy Notes]]
- [[Signup Test]]
- [[Login Test]]
- [[Onboarding Test]]
- [[Create Post Test]]
- [[Upload Test]]
- [[Comment Test]]
- [[Vote Test]]
- [[Search Test]]
- [[Profile Edit Test]]
- [[Admin Protection Test]]

## Launch Gate

Before public launch, these must be reviewed:

- [[Supabase RLS]]
- [[Service Role Key Protection]]
- [[Upload Security]]
- [[XSS Prevention]]
- [[Admin Route Protection]]
- [[Rate Limiting]]
- [[Auth Redirect Checks]]
- [[Error Leakage Prevention]]
- [[Spam Prevention]]
