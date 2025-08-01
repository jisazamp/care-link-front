import { z } from "zod";

export enum Profession {
  Medico = "Médico",
  Enfermero = "Enfermero",
  Nutricionista = "Nutricionista",
  Psicologo = "Psicólogo",
  Fisioterapeuta = "Fisioterapeuta",
}

export enum Specialty {
  Cardiologia = "Cardiología",
  Pediatria = "Pediatría",
  Nutricion = "Nutrición",
  PsicologiaClinica = "Psicología Clínica",
  Fisioterapia = "Fisioterapia",
}

export enum Charge {
  JefeDepartamento = "Jefe de Departamento",
  Especialista = "Especialista",
  Residente = "Residente",
}

export const professionalDataSchema = z.object({
  documentNumber: z.string().min(1, "Número de documento requerido").optional(),
  professionalId: z.string().min(1, "ID profesional requerido").optional(),
  birthdate: z
    .date({ required_error: "Fecha de nacimiento requerida" })
    .optional(),
  entryDate: z
    .date({ required_error: "Fecha de ingreso requerida" })
    .optional(),
  profession: z
    .nativeEnum(Profession, {
      errorMap: () => ({ message: "Profesión requerida" }),
    })
    .optional(),
  specialty: z
    .nativeEnum(Specialty, {
      errorMap: () => ({ message: "Especialidad requerida" }),
    })
    .optional(),
  charge: z
    .nativeEnum(Charge, {
      errorMap: () => ({ message: "Cargo requerido" }),
    })
    .optional(),
  phone: z.string().min(1, "Teléfono requerido").optional(),
  address: z.string().min(1, "Dirección requerida").optional(),
});

export type ProfessionalDataDTO = z.infer<typeof professionalDataSchema>;
