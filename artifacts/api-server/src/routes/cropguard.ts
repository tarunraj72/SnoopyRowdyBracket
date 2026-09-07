import { Router, type IRouter } from "express";
import {
  CreateCommunityPostBody,
  CreateDetectionBody,
  CreateExpertRequestBody,
  CreateFieldBody,
  DemoLoginBody,
  GetDetectionRecommendationsParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

type DetectionRecord = {
  id: number;
  crop: string;
  disease: string;
  diseaseHindi: string;
  type: "disease" | "pest" | "healthy";
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
  detectedAt: string;
  imageUrl: string | null;
  sampleId: string | null;
};

const now = () => new Date().toISOString();

const detections: DetectionRecord[] = [
  {
    id: 101,
    crop: "Tomato",
    disease: "Early blight",
    diseaseHindi: "अगेती झुलसा",
    type: "disease",
    confidence: 0.94,
    severity: "medium",
    description:
      "Brown target-like spots are spreading on lower leaves. Early action can protect the next fruiting cycle.",
    detectedAt: "2026-09-05T07:40:00.000Z",
    imageUrl: "/sample-tomato.svg",
    sampleId: "tomato-blight",
  },
  {
    id: 102,
    crop: "Cotton",
    disease: "American bollworm",
    diseaseHindi: "अमेरिकन सुंडी",
    type: "pest",
    confidence: 0.89,
    severity: "high",
    description:
      "Boll damage pattern suggests a bollworm risk. Scout five plants in each corner before spraying.",
    detectedAt: "2026-09-02T05:15:00.000Z",
    imageUrl: "/sample-cotton.svg",
    sampleId: "cotton-bollworm",
  },
  {
    id: 103,
    crop: "Rice",
    disease: "Healthy crop",
    diseaseHindi: "स्वस्थ फसल",
    type: "healthy",
    confidence: 0.97,
    severity: "low",
    description:
      "No common disease pattern detected. Keep monitoring after rain and maintain field drainage.",
    detectedAt: "2026-08-27T06:05:00.000Z",
    imageUrl: "/sample-rice.svg",
    sampleId: "rice-healthy",
  },
];

const fields = [
  { id: 1, name: "North field", crop: "Tomato", acres: 2.5, village: "Kothapally", lastScanned: "2 days ago" },
  { id: 2, name: "Canal side", crop: "Cotton", acres: 4, village: "Kothapally", lastScanned: "5 days ago" },
];

const alerts = [
  {
    id: 1,
    title: "Fungal disease watch",
    message: "Humidity is expected above 82% for 2 nights. Inspect tomato and chilli leaves at sunrise.",
    severity: "urgent" as const,
    area: "Your region · Kothapally",
    time: "Today, 6:30 AM",
    icon: "droplets",
  },
  {
    id: 2,
    title: "Cotton pest scouting",
    message: "Bollworm activity is rising across nearby mandals. Check flowers and young bolls this week.",
    severity: "watch" as const,
    area: "Warangal district",
    time: "Yesterday",
    icon: "bug",
  },
  {
    id: 3,
    title: "Good spray window",
    message: "Low wind and no rain expected tomorrow morning between 6–9 AM.",
    severity: "info" as const,
    area: "Your region",
    time: "Yesterday",
    icon: "cloud-sun",
  },
];

const posts = [
  {
    id: 1,
    title: "White powder on my chilli leaves",
    body: "Can someone help identify this? It started after the last cloudy week.",
    crop: "Chilli",
    author: "Savitri · Nalgonda",
    replies: 4,
    postedAt: "2 hours ago",
    expertAnswered: true,
  },
  {
    id: 2,
    title: "Best neem spray timing for cotton?",
    body: "I want to reduce chemical sprays. When should I apply neem seed kernel extract?",
    crop: "Cotton",
    author: "Ramesh · Warangal",
    replies: 2,
    postedAt: "Yesterday",
    expertAnswered: false,
  },
];

const recommendations = {
  "early blight": {
    organic: [
      { title: "Remove infected leaves", detail: "Pick and bury badly spotted lower leaves away from the field. Do not compost them.", dosage: null, priority: "now" as const },
      { title: "Neem + soap spray", detail: "Spray the underside of leaves in the cool hours and repeat after 7 days.", dosage: "5 ml neem oil + 1 ml mild soap per litre of water", priority: "soon" as const },
    ],
    chemical: [
      { title: "Protectant fungicide", detail: "Use only a product registered for tomato in your state and follow the label.", dosage: "Mancozeb 75 WP: 2 g per litre of water", priority: "soon" as const },
    ],
    prevention: [
      { title: "Keep leaves dry", detail: "Water at soil level, improve spacing, and avoid evening irrigation.", dosage: null, priority: "prevent" as const },
      { title: "Rotate the crop", detail: "Avoid tomato, potato, and brinjal on the same plot for the next season.", dosage: null, priority: "prevent" as const },
    ],
  },
  "american bollworm": {
    organic: [
      { title: "Scout before spraying", detail: "Check five plants at each corner and count eggs or small larvae.", dosage: "Act when 5% plants show fresh damage", priority: "now" as const },
      { title: "Neem seed kernel extract", detail: "Spray in the evening and cover flower buds well.", dosage: "50 g kernel powder per litre of water", priority: "soon" as const },
    ],
    chemical: [
      { title: "Target small larvae", detail: "Use a label-approved option only after scouting; rotate chemical groups.", dosage: "Emamectin benzoate 5 SG: 0.4 g per litre", priority: "soon" as const },
    ],
    prevention: [
      { title: "Use pheromone traps", detail: "Install traps and remove damaged bolls during weekly scouting.", dosage: "5 traps per acre", priority: "prevent" as const },
      { title: "Avoid unnecessary sprays", detail: "Protect beneficial insects and prevent resistance by following the label.", dosage: null, priority: "prevent" as const },
    ],
  },
  default: {
    organic: [
      { title: "Monitor twice a week", detail: "Walk the field in a zig-zag pattern and check new leaves first.", dosage: null, priority: "soon" as const },
    ],
    chemical: [],
    prevention: [
      { title: "Keep a field record", detail: "Record the crop, weather, and every treatment so next season starts smarter.", dosage: null, priority: "prevent" as const },
    ],
  },
};

router.post("/auth/demo-login", (req, res) => {
  const parsed = DemoLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  res.json({
    token: `cropguard-demo-${Date.now()}`,
    user: {
      id: "demo-farmer-01",
      name: parsed.data.name,
      role: "farmer",
      village: "Kothapally",
      state: "Telangana",
    },
  });
});

router.get("/detections", (_req, res) => res.json(detections));

router.post("/detections", (req, res) => {
  const parsed = CreateDetectionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const sampleResults: Record<string, DetectionRecord> = {
    "tomato-blight": detections[0],
    "cotton-bollworm": detections[1],
    "rice-healthy": detections[2],
  };
  const sample = parsed.data.sampleId ? sampleResults[parsed.data.sampleId] : undefined;
  const record: DetectionRecord = sample
    ? { ...sample, id: Math.max(...detections.map((item) => item.id)) + 1, detectedAt: now() }
    : {
        id: Math.max(...detections.map((item) => item.id)) + 1,
        crop: parsed.data.crop,
        disease: "Needs expert review",
        diseaseHindi: "विशेषज्ञ की जाँच ज़रूरी",
        type: "disease",
        confidence: 0.71,
        severity: "medium",
        description: "The demo classifier found a possible stress pattern. Compare with the guidance below and ask an expert if symptoms continue.",
        detectedAt: now(),
        imageUrl: parsed.data.imageDataUrl ?? null,
        sampleId: null,
      };
  detections.unshift(record);
  res.status(201).json(record);
});

router.get("/detections/:id/recommendations", (req, res) => {
  const params = GetDetectionRecommendationsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const detection = detections.find((item) => item.id === params.data.id);
  const key = detection?.disease.toLowerCase() ?? "default";
  res.json(recommendations[key as keyof typeof recommendations] ?? recommendations.default);
});

router.get("/dashboard/summary", (_req, res) => {
  res.json({
    totalScans: detections.length + 8,
    activeFields: fields.length,
    highRiskAlerts: alerts.filter((alert) => alert.severity === "urgent").length,
    cropSavedAcres: 6.5,
    trend: [
      { label: "Apr", value: 3 },
      { label: "May", value: 5 },
      { label: "Jun", value: 4 },
      { label: "Jul", value: 7 },
      { label: "Aug", value: 6 },
      { label: "Sep", value: 3 },
    ],
    commonIssues: [
      { label: "Fungal", value: 9 },
      { label: "Pests", value: 6 },
      { label: "Healthy", value: 4 },
    ],
  });
});

router.get("/fields", (_req, res) => res.json(fields));

router.post("/fields", (req, res) => {
  const parsed = CreateFieldBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const field = {
    ...parsed.data,
    id: Math.max(...fields.map((item) => item.id)) + 1,
    lastScanned: "Not scanned yet",
  };
  fields.push(field);
  res.status(201).json(field);
});

router.get("/alerts", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=17.98&longitude=79.59&current=temperature_2m,relative_humidity_2m,precipitation&hourly=relative_humidity_2m,precipitation_probability&forecast_days=1&timezone=Asia%2FKolkata",
      { signal: AbortSignal.timeout(4000) },
    );
    if (!response.ok) {
      throw new Error(`Weather provider returned ${response.status}`);
    }
    const weather = (await response.json()) as {
      current?: {
        temperature_2m?: number;
        relative_humidity_2m?: number;
        precipitation?: number;
      };
    };
    const humidity = Math.round(weather.current?.relative_humidity_2m ?? 68);
    const temperature = Math.round(weather.current?.temperature_2m ?? 28);
    const rain = weather.current?.precipitation ?? 0;
    const weatherAlert = {
      id: 99,
      title: humidity >= 80 ? "Live fungal disease watch" : "Live field weather",
      message:
        humidity >= 80
          ? `Humidity is ${humidity}% around Kothapally. Inspect tomato, chilli, and paddy leaves at sunrise.`
          : `Humidity is ${humidity}% around Kothapally with ${rain} mm rain now. Keep scouting after the next shower.`,
      severity: humidity >= 80 ? ("urgent" as const) : ("info" as const),
      area: "Kothapally · Open-Meteo",
      time: `Live · ${temperature}°C`,
      icon: "cloud-sun",
    };
    res.json([weatherAlert, ...alerts]);
  } catch (error) {
    req.log.warn({ err: error }, "Weather provider unavailable; using seeded alerts");
    res.json(alerts);
  }
});
router.get("/community/posts", (_req, res) => res.json(posts));

router.post("/community/posts", (req, res) => {
  const parsed = CreateCommunityPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const post = {
    ...parsed.data,
    id: Math.max(...posts.map((item) => item.id)) + 1,
    author: "You · Kothapally",
    replies: 0,
    postedAt: "Just now",
    expertAnswered: false,
  };
  posts.unshift(post);
  res.status(201).json(post);
});

router.post("/community/expert-requests", (req, res) => {
  const parsed = CreateExpertRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  res.status(201).json({
    ...parsed.data,
    id: Date.now(),
    status: "queued",
    eta: "Usually replies within 24 hours",
  });
});

export default router;