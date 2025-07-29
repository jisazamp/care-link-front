import type {
  CreateAuthorizedUserPayload,
  UpdateAuthorizedUserPayload,
} from "../../types";
import {
  Charge,
  Profession,
  Specialty,
} from "../ProfessionalDataForm/index.schema";
import { RolesEnum, type UserDTO } from "./index.schema";

interface BasicUserApiResponse {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface ProfessionalApiResponse {
  n_documento?: string;
  t_profesional?: string;
  fecha_nacimiento?: string;
  fecha_ingreso?: string;
  profesion?: string;
  especialidad?: string;
  cargo?: string;
  telefono?: number | string;
  direccion?: string;
}

export const buildUpdateAuthorizedUserPayload = (
  userId: number,
  data: UserDTO,
): UpdateAuthorizedUserPayload => ({
  id: userId,
  email: data.email,
  first_name: data.firstName,
  last_name: data.lastName,
  role: data.role,
  password: data.password,
  ...(data.role === RolesEnum.Profesional && data.professional_user
    ? {
        document_number: data.professional_user.documentNumber,
        professional_id_number: data.professional_user.professionalId,
        birthdate: data.professional_user.birthdate
          ?.toISOString()
          .split("T")[0],
        entry_date: data.professional_user.entryDate
          ?.toISOString()
          .split("T")[0],
        profession: data.professional_user.profession,
        specialty: data.professional_user.specialty,
        charge: data.professional_user.charge,
        phone_number: data.professional_user.phone,
        home_address: data.professional_user.address,
      }
    : {}),
});

export const mapUserDTOToEntity = (
  dto: UserDTO,
): Omit<CreateAuthorizedUserPayload, "id" | "is_deleted"> => {
  const basePayload: Omit<CreateAuthorizedUserPayload, "id" | "is_deleted"> = {
    email: dto.email,
    first_name: dto.firstName,
    last_name: dto.lastName,
    password: dto.password,
    role: dto.role,
  };

  if (dto.professional_user) {
    basePayload.professional_user = {
      birthdate:
        dto.professional_user.birthdate?.toISOString().split("T")[0] ?? "",
      charge: dto.professional_user.charge ?? "",
      document_number: dto.professional_user.professionalId ?? "",
      email: dto.email,
      entry_date:
        dto.professional_user.entryDate?.toISOString().split("T")[0] ?? "",
      first_name: dto.firstName,
      home_address: dto.professional_user.address ?? "",
      last_name: dto.lastName,
      phone_number: dto.professional_user.phone ?? "",
      profession: dto.professional_user.profession ?? "",
      professional_id_number: dto.professional_user.professionalId ?? "",
      specialty: dto.professional_user.specialty ?? "",
    };
  }

  return basePayload;
};

export const populateFormFromApi = (
  basicData: BasicUserApiResponse | undefined,
  profData: ProfessionalApiResponse | undefined,
): Partial<UserDTO> => {
  if (!basicData) return {};

  const formValues: Partial<UserDTO> = {
    email: basicData.email,
    firstName: basicData.first_name,
    lastName: basicData.last_name,
    role: basicData.role as RolesEnum,
  };

  if (basicData.role === RolesEnum.Profesional && profData) {
    formValues.professional_user = {
      documentNumber: profData.n_documento ?? "",
      professionalId: profData.t_profesional ?? "",
      birthdate: profData.fecha_nacimiento
        ? new Date(profData.fecha_nacimiento)
        : undefined,
      entryDate: profData.fecha_ingreso
        ? new Date(profData.fecha_ingreso)
        : undefined,
      profession: profData.profesion as Profession,
      specialty: profData.especialidad as Specialty,
      charge: profData.cargo as Charge,
      phone: String(profData.telefono ?? ""),
      address: profData.direccion ?? "",
    };
  }

  return formValues;
};
