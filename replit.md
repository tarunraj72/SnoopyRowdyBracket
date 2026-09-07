# CropGuard AI

CropGuard AI is a multilingual, offline-friendly crop disease and pest early-warning companion for Indian farmers, extension officers, and KVK staff.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/cropguard-ai` — React + Vite farmer-facing application and SIH demo routes
- `artifacts/api-server/src/routes/cropguard.ts` — demo detection, recommendation, field, alerts, and community API
- `lib/api-spec/openapi.yaml` — source-of-truth API contract
- `lib/db/src/schema/cropguard.ts` — PostgreSQL tables for users, fields, detections, and community posts
- `artifacts/cropguard-ai/README.md` — architecture, model adapter, and roadmap

## Architecture decisions

- The API contract is OpenAPI-first so frontend hooks, Zod validation, and server behavior stay aligned.
- The current detection adapter is deterministic for SIH judging and includes bundled sample imagery; it is shaped for a PlantVillage-trained ONNX/TFLite or Plant.id adapter later.
- Recommendations are separate from detection classes so agronomists can update treatment guidance without retraining inference.
- Open-Meteo provides live no-key weather context for the alerts screen, with seeded alerts as a clear offline fallback.
- The client stores demo session, language choice, and failed scan submissions locally for low-connectivity behavior.

## Product

CropGuard includes demo sign-in, camera/gallery image capture, bundled sample scans, confidence and severity results, organic and chemical guidance, English/Hindi/Telugu UI, read-aloud support, weather risk alerts, field history, trend summaries, community questions, expert requests, offline queue states, and an Impact & Scalability page for SIH judging.

## User preferences

- Prioritize a working end-to-end SIH demo over exhaustive production integrations.

## Gotchas

- Regenerate API hooks after changing `lib/api-spec/openapi.yaml`.
- The Vite build requires workflow-provided `PORT` and `BASE_PATH`; use the managed web workflow for previews.
- Chemical dosages in the demo are illustrative and must be validated against current state registrations and product labels before production use.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
