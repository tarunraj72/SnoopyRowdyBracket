# CropGuard AI

CropGuard AI is a Smart India Hackathon demo for early detection and management of crop diseases and pest infestations. It is designed for Indian farmers, agricultural extension officers, and Krishi Vigyan Kendra staff who need a fast, understandable next step after spotting a problem in the field.

## Demo flow

1. Open the app and enter any name/contact on the judge-ready demo sign-in.
2. Choose **Scan a crop**.
3. Use one of the bundled sample crops (cotton bollworm, tomato early blight, or healthy rice) or upload/capture a photo.
4. Review confidence, severity, the affected crop, and localized recommendations.
5. Use **Read aloud** for low-literacy support.
6. Explore field history, alerts, farmer questions, expert requests, and the **Impact & scale** page.

## Architecture

- **Frontend:** React + Vite, Tailwind CSS, Wouter routing, TanStack Query, and Lucide icons.
- **API:** Node.js + Express under the shared `/api` service.
- **Contract:** `lib/api-spec/openapi.yaml` is the source of truth; generated React Query hooks and Zod schemas live in `lib/api-client-react` and `lib/api-zod`.
- **Database:** PostgreSQL schema tables are defined in `lib/db/src/schema/cropguard.ts` for users, fields, detections, and community posts.
- **Offline behavior:** The scan flow stores failed/offline submissions in local storage and clearly shows a queued-for-sync state.
- **Localization:** English, Hindi, and Telugu labels are stored in the frontend language dictionary. The browser SpeechSynthesis API provides read-aloud results.

## Detection model

The current SIH demo uses a deterministic sample catalog so judges can run the complete experience without a model download, API key, or camera access. The result contract is intentionally shaped like a PlantVillage-style classifier response: crop, class, confidence, severity, explanation, and timestamp.

For production, replace the `POST /api/detections` adapter with one of:

- a PlantVillage-trained TensorFlow Lite/ONNX model hosted behind the API;
- an edge model running in the browser for low-connectivity districts; or
- a connected Plant.id / Kindwise classification provider after account authorization.

Recommendations are kept separate from inference so agronomists can update treatment guidance without retraining the classifier. Chemical dosages shown in the demo are illustrative and must be validated against current state registrations and product labels before production use.

## Future roadmap

- PlantVillage-trained regional model with crop/state calibration and confidence thresholds.
- Weather provider connection for live humidity, rainfall, and spray-window signals.
- SMS/WhatsApp notification delivery for farmers without reliable app connectivity.
- Drone imagery and IoT soil/weather sensor context for KVK and extension dashboards.
- More state languages, voice-first onboarding, and human-in-the-loop expert verification.
- Real Clerk authentication and role-aware officer/KVK workspaces for production.

## Run

```bash
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/cropguard-ai run dev
```

The app is intentionally optimized for a guided SIH judging demo first; the provider adapters and persisted schema leave a clear path to production integrations.