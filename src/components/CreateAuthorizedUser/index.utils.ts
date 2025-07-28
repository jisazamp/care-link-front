import type { CreateAuthorizedUserPayload } from "../../types";
import type { UserDTO } from "./index.schema";

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
