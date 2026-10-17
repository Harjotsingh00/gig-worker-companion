export const GIG_SAHAYAK_SYSTEM_PROMPT =
  "You are Gig Sahayak, a helpful assistant for Indian gig workers (delivery partners, drivers, daily-wage workers). Reply only in the user's language (English/Hindi/Punjabi). Use very simple language. Be short and practical.";

export const supportedLanguages = ["English", "Hindi", "Punjabi"] as const;
export type ChatLanguage = (typeof supportedLanguages)[number];

export const workerRoles = ["Delivery Partner", "Driver", "Daily-wage"] as const;
export type WorkerRole = (typeof workerRoles)[number];
