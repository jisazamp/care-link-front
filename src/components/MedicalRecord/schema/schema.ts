import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";

export const pharmacotherapeuticRegimenSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  endDate: z.custom<Dayjs>((val) => val instanceof dayjs, "Fecha incorrecta"),
  frequency: z.string().min(1, "La frecuencia es requerida"),
  medicine: z.string().min(1, "El medicamento es requerido"),
  startDate: z.custom<Dayjs>((val) => val instanceof dayjs, "Fecha incorrecta"),
});

export type PharmacoRegimen = z.infer<typeof pharmacotherapeuticRegimenSchema>;

export const surgeriesSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  date: z.custom<Dayjs>((val) => val instanceof dayjs, "Fecha incorrecta"),
  observation: z.string(),
});

export const nursingCarePlanSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  diagnosis: z.string().min(1, "El diagnóstico es requerido"),
  intervention: z.string().min(1, "La intervención es requerida"),
  frequency: z.string().min(1, "La frecuencia es requerida"),
});

export type NursingCarePlan = z.infer<typeof nursingCarePlanSchema>;

export const physioterapeuticRegimenSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  diagnosis: z.string().min(1, "El diagnóstico es requerido"),
  intervention: z.string().min(1, "La intervención es requerida"),
  frequency: z.string().min(1, "La frecuencia es requerida"),
});

export type PhysioRegimen = z.infer<typeof physioterapeuticRegimenSchema>;

export const alergiesSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  medicine: z.string(),
});

export const dietSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  diet: z.string(),
  observation: z.string(),
});

export const disabilitySchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  disability: z.string(),
  observation: z.string(),
});

export const limitationsSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  limitation: z.string(),
  observation: z.string(),
});

export const otherAlergies = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  alergy: z.string(),
  observation: z.string(),
});

export const formSchema = z.object({
  bloodPressure: z.number({ coerce: true }).nullable().default(null),
  bloodType: z.string().nullable().default(null),
  bpm: z.number({ coerce: true }).nullable().default(null),
  entryDate: z.custom<Dayjs>((val) => val instanceof dayjs, "Fecha incorrecta"),
  entryReason: z.string().default(""),
  eps: z.string().nullable().default(null),
  externalService: z.string().nullable().default(null),
  externalServicePhone: z.string().nullable().default(null),
  hasExternalService: z.boolean().default(false),
  height: z.number({ coerce: true }).default(0),
  medicalTreatments: z.array(z.string()).default([]),
  specialConditions: z.array(z.string()).default([]),
  pharmacotherapeuticRegimen: z
    .array(pharmacotherapeuticRegimenSchema)
    .default([]),
  nursingCarePlan: z.array(nursingCarePlanSchema).default([]),
  physioterapeuticRegimen: z.array(physioterapeuticRegimenSchema).default([]),
  diet: z.array(dietSchema).default([]),
  alergies: z.array(alergiesSchema).default([]),
  disabilities: z.array(disabilitySchema).default([]),
  limitations: z.array(limitationsSchema).default([]),
  otherAlergies: z.array(otherAlergies).default([]),
  surgeries: z.array(surgeriesSchema).default([]),
  temperature: z.number({ coerce: true }).nullable().default(null),
  weight: z.number({ coerce: true }).nullable().default(null),
  feeding: z.string(),
  sleepType: z.string(),
  continence: z.boolean(),
  mobility: z.string(),
  personalCare: z.string(),
  personalAppearance: z.string(),
  tabaquism: z.boolean(),
  psycoactive: z.boolean(),
  alcholism: z.boolean(),
  caffeine: z.boolean(),
  verbalCommunication: z.string(),
  nonVerbalCommunication: z.string(),
  mood: z.string(),
  abused: z.boolean(),
  initialDiagnosis: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
