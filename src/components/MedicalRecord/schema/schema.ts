import dayjs, { type Dayjs } from "dayjs";
import { z } from "zod";

export const pharmacotherapeuticRegimenSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  frequency: z.string().min(1, "La frecuencia es requerida"),
  medicine: z.string().min(1, "El medicamento es requerido"),
  observations: z.string(),
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

export const vaccineSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  date: z
    .custom<Dayjs>((val) => val instanceof dayjs, "Fecha incorrecta")
    .optional(),
  name: z.string(),
  nextDate: z
    .custom<Dayjs>((val) => val instanceof dayjs, "Fecha incorrecta")
    .optional(),
  secondaryEffects: z.string().optional(),
});

export type Vaccine = z.infer<typeof vaccineSchema>;

export const alergiesSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  medicine: z.string(),
});

export const dietSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  diet: z.string(),
});

export const disabilitySchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  disability: z.string(),
});

export const limitationsSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  limitation: z.string(),
});

export const diagnosticSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  diagnostic: z.string(),
});

export const otherAlergies = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  alergy: z.string(),
});

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "El archivo debe pesar menos de 5MB",
  });

const attachedDocumentsSchema = z
  .array(fileSchema)
  .optional()
  .refine(
    (files) =>
      !files ||
      files.length === 0 ||
      files.every((file) => file instanceof File),
    {
      message: "Todos los archivos deben ser válidos",
    },
  );

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
  diagnostic: z.array(diagnosticSchema).default([]),
  surgeries: z.array(surgeriesSchema).default([]),
  temperature: z.number({ coerce: true }).nullable().default(null),
  weight: z.number({ coerce: true }).nullable().default(null),
  feeding: z.string().nullable().default(null),
  sleepType: z.string().nullable().default(null),
  continence: z.string().nullable().default(null),
  mobility: z.string().nullable().default(null),
  personalCare: z.string().nullable().default(null),
  personalAppearance: z.string().nullable().default(null),
  tabaquism: z.string().nullable().default(null),
  psycoactive: z.string().nullable().default(null),
  alcholism: z.string().nullable().default(null),
  caffeine: z.string().nullable().default(null),
  verbalCommunication: z.string().nullable().default(null),
  nonVerbalCommunication: z.string().nullable().default(null),
  mood: z.string().nullable().default(null),
  abused: z.string().nullable().default(null),
  initialDiagnosis: z.string().optional().default(""),
  attachedDocuments: attachedDocumentsSchema,
});

export type FormValues = z.infer<typeof formSchema>;
