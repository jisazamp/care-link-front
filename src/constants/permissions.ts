import { RolesEnum } from "../components/CreateAuthorizedUser/index.schema";

export const permissions: Record<string, RolesEnum[]> = {
  "/ShowMedicalReport": [RolesEnum.Admin, RolesEnum.Profesional],
  "/UserList": [RolesEnum.Admin, RolesEnum.Profesional],
  "/actividades": [RolesEnum.Admin],
  "/admin": [RolesEnum.Admin],
  "/home": [RolesEnum.Admin, RolesEnum.Profesional],
  "/usuarios": [RolesEnum.Admin, RolesEnum.Profesional],
  "/visitas-domiciliarias": [RolesEnum.Admin, RolesEnum.Profesional],
  "/pruebas": [RolesEnum.Admin, RolesEnum.Profesional],
  "/cronograma": [RolesEnum.Admin, RolesEnum.Profesional],
  "/transporte": [RolesEnum.Admin, RolesEnum.Profesional, RolesEnum.Transporte],
  "/facturacion": [RolesEnum.Admin, RolesEnum.Profesional],
};
