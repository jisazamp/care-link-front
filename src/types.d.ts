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
  cirugias: string | null;
  comunicacion_no_verbal: string;
  comunicacion_verbal: string;
  continencia: boolean;
  cuidado_personal: string;
  dieta_especial: string | null;
  discapacidades: string | null;
  emer_medica: string;
  eps: string;
  estado_de_animo: string;
  fecha_ingreso: string;
  frecuencia_cardiaca: number;
  historial_cirugias: string;
  id_usuario: number;
  limitaciones: string | null;
  maltratado: boolean;
  maltrato: boolean;
  medicamentos_alergia: string | null;
  motivo_ingreso: string;
  observ_dietaEspecial: string;
  observ_otrasalergias: string;
  observaciones_iniciales: string;
  otras_alergias: string | null;
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
};

export type MedicalReport = {
  id_reporteclinico: number;
  id_historiaclinica: number;
  id_profesional: number;
  Circunferencia_cadera: number;
  Frecuencia_cardiaca: number;
  IMC: number;
  Obs_habitosalimenticios: string;
  Porc_grasacorporal: number;
  Porc_masamuscular: number;
  area_afectiva: string;
  area_comportamental: string;
  areacognitiva: string;
  areainterpersonal: string;
  areasomatica: string;
  circunferencia_cintura: number;
  consumo_aguadiaria: number;
  diagnostico: string;
  fecha_registro: string;
  frecuencia_actividadfisica: string;
  frecuencia_respiratoria: number;
  motivo_consulta: string;
  nivel_dolor: number;
  observaciones: string;
  peso: number;
  presion_arterial: number;
  profesional: Professional | null;
  pruebas_examenes: string;
  recomendaciones: string;
  remision: string;
  saturacionOxigeno: number;
  temperatura_corporal: number;
  tipo_reporte: string;
};

export type Professional = {
  id_profesional: number;
  apellidos: string;
  cargo: string;
  direccion: string;
  e_mail: string;
  especialidad: string;
  estado: string;
  fecha_ingreso: string;
  fecha_nacimiento: string;
  n_documento: string;
  nombres: string;
  profesion: string;
  t_profesional: string;
  telefono: number;
};

export type UserMedicine = {
  id?: string | number;
  medicamento: string;
  periodicidad: string;
  Fecha_inicio: string;
  fecha_fin: string;
};

export type UserCare = {
  id?: string | number;
  diagnostico: string;
  frecuencia: string;
  intervencion: string;
};

export type UserIntervention = {
  id?: string | number;
  diagnostico: string;
  frecuencia: string;
  intervencion: string;
};

export type UserVaccine = {
  id?: string | number;
  efectos_secundarios?: string;
  fecha_administracion?: string;
  fecha_proxima?: string;
  vacuna: string;
};

export type ClinicalEvolution = {
  id_TipoReporte: number;
  id_profesional: number;
  id_reporteclinico: number;
  fecha_evolucion: string;
  observacion_evolucion: string;
  profesional: Professional;
  tipo_report: string;
};

export type Activity = {
  id: number;
  id_profesional?: number;
  id_tipo_actividad?: number;
  comentarios?: string | null;
  descripcion?: string | null;
  duracion?: number | null;
  fecha?: string | null;
  nombre: string;
  profesional?: Professional;
  tipo_actividad?: ActivityType;
}

export type ActivityType = {
  id: number;
  tipo: string;
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
