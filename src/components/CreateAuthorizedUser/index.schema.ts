import { z } from "zod";
import {
  type ProfessionalDataDTO,
  professionalDataSchema,
} from "../ProfessionalDataForm/index.schema";

export enum RolesEnum {
  Admin = "admin",
  Profesional = "profesional",
  Transporte = "transporte",
}

export const userSchema = z
  .object({
    email: z
      .string({ message: "Este campo es obligatorio" })
      .min(1, "El correo es obligatorio")
      .email("Correo inválido"),
    firstName: z
      .string({ message: "Este campo es obligatorio" })
      .min(1, "El nombre es obligatorio"),
    lastName: z
      .string({ message: "Este campo es obligatorio" })
      .min(1, "El apellido es obligatorio"),
    password: z
      .string({ message: "Este campo es obligatorio" })
      .min(6, "Mínimo 6 caracteres"),
    confirmPassword: z
      .string({ message: "Este campo es obligatorio" })
      .min(1, "Confirma tu contraseña"),
    role: z.nativeEnum(RolesEnum, {
      errorMap: () => ({ message: "El rol es obligatorio" }),
    }),
    professional_user: professionalDataSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  })
  .superRefine((data, ctx) => {
    if (data.role === RolesEnum.Profesional) {
      const requiredFields: (keyof ProfessionalDataDTO)[] = [
        "address",
        "birthdate",
        "charge",
        "documentNumber",
        "entryDate",
        "phone",
        "profession",
        "professionalId",
        "specialty",
      ];

      if (!data.professional_user) {
        ctx.addIssue({
          path: ["professional_user"],
          code: z.ZodIssueCode.custom,
          message: "Los datos profesionales son obligatorios para este rol",
        });
        return;
      }

      for (const field of requiredFields) {
        if (!data.professional_user[field]) {
          ctx.addIssue({
            path: ["professional_user", field],
            code: z.ZodIssueCode.custom,
            message: "Campo requerido para usuarios profesionales",
          });
        }
      }
    }
  });

export const editUserSchema = z
  .object({
    email: z
      .string({ message: "Este campo es obligatorio" })
      .min(1, "El correo es obligatorio")
      .email("Correo inválido"),
    firstName: z
      .string({ message: "Este campo es obligatorio" })
      .min(1, "El nombre es obligatorio"),
    lastName: z
      .string({ message: "Este campo es obligatorio" })
      .min(1, "El apellido es obligatorio"),
    password: z
      .string({ message: "Este campo es obligatorio" })
      .min(6, "Mínimo 6 caracteres")
      .optional(),
    confirmPassword: z
      .string({ message: "Este campo es obligatorio" })
      .min(1, "Confirma tu contraseña")
      .optional(),
    role: z.nativeEnum(RolesEnum, {
      errorMap: () => ({ message: "El rol es obligatorio" }),
    }),
    professional_user: professionalDataSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  })
  .superRefine((data, ctx) => {
    if (data.role === RolesEnum.Profesional) {
      const requiredFields: (keyof ProfessionalDataDTO)[] = [
        "address",
        "birthdate",
        "charge",
        "documentNumber",
        "entryDate",
        "phone",
        "profession",
        "professionalId",
        "specialty",
      ];

      if (!data.professional_user) {
        ctx.addIssue({
          path: ["professional_user"],
          code: z.ZodIssueCode.custom,
          message: "Los datos profesionales son obligatorios para este rol",
        });
        return;
      }

      for (const field of requiredFields) {
        if (!data.professional_user[field]) {
          ctx.addIssue({
            path: ["professional_user", field],
            code: z.ZodIssueCode.custom,
            message: "Campo requerido para usuarios profesionales",
          });
        }
      }
    }
  });

export type UserDTO = z.infer<typeof userSchema>;
