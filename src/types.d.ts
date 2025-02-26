import {
  Gender,
  CivilStatus,
  UserStatus,
  UserFamilyType,
  Kinship,
} from "./enums";

export type User = {
  apellidos: string | null;
  direccion: string | null;
  email: string | null;
  escribe: boolean | null;
  estado: UserStatus | null;
  estado_civil: CivilStatus | null;
  fecha_nacimiento: string | null;
  fecha_registro: string | null;
  genero: Gender | null;
  grado_escolaridad: string | null;
  ha_estado_en_otro_centro: boolean | null;
  id_usuario: number | null;
  lee: boolean | null;
  lugar_nacimiento: string | null;
  lugar_procedencia: string | null;
  n_documento: string | null;
  nombres: string | null;
  nucleo_familiar: UserFamilyType | null;
  ocupacion_quedesempeño: string | null;
  origen_otrocentro: string | null;
  proteccion_exequial: boolean | null;
  regimen_seguridad_social: string | null;
  telefono: string | null;
  tipo_afiliacion: string | null;
  is_deleted: boolean;
};

export interface FamilyMember {
  acudiente: boolean | null;
  apellidos: string;
  direccion: string | null;
  email: string | null;
  id_acudiente: number;
  is_deleted: boolean | null;
  n_documento: string;
  nombres: string;
  telefono: string | null;
  vive: boolean | null;
}

interface FamilyMemberResponse extends FamilyMember {
  parentesco: string;
}

export type AuthorizedUser = {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  password: string;
  is_deleted: boolean;
};

export type MedicalRecord = {
  id_historiaclinica?: number;
  Tiene_OtrasAlergias: boolean;
  Tienedieta_especial: boolean;
  alcoholismo: boolean;
  alergico_medicamento: boolean;
  altura: number;
  apariencia_personal: string;
  cafeina: boolean;
  cirugias: boolean;
  comunicacion_no_verbal: string;
  comunicacion_verbal: string;
  continencia: boolean;
  cuidado_personal: string;
  discapacidad: boolean;
  emer_medica: string;
  eps: string;
  estado_de_animo: string;
  fecha_ingreso: string;
  frecuencia_cardiaca: number;
  historial_cirugias: string;
  id_usuario: number;
  maltratado: boolean;
  maltrato: boolean;
  medicamentos_alergia: string;
  motivo_ingreso: string;
  observ_dietaEspecial: string;
  observ_otrasalergias: string;
  observaciones_iniciales: string;
  peso: number;
  presion_arterial: number;
  sustanciaspsico: boolean;
  tabaquismo: boolean;
  telefono_emermedica: string;
  temperatura_corporal: number;
  tipo_alimentacion: string;
  tipo_de_movilidad: string;
  tipo_de_sueno: string;
  tipo_sangre: string;
}

export type UserMedicine = {
  medicamento: string;
  periodicidad: string;
  Fecha_inicio: string;
  fecha_fin: string;
}

export type UserCare = {
  diagnostico: string;
  frecuencia: string;
  intervencion: string;
}

export type UserIntervention = {
  diagnostico: string;
  frecuencia: string;
  intervencion: string;
}

export type Login = {
  access_token: string;
  token_type: "bearer";
};

export type CreateFamilyMemberRequest = {
  userId?: number | string;
  family_member: Omit<FamilyMember, "id_acudiente">;
  kinship: { parentezco: Kinship };
};
