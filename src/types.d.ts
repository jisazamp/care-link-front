import type { CivilStatus, Gender, UserFamilyType, UserStatus } from "./enums";

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
  is_deleted: boolean;
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
  profesion: string | null;
  tipo_usuario: string | null;
  url_imagen?: string | null;
  visitas_domiciliarias?: boolean;
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
  id_profesional?: number | null;
  Tiene_OtrasAlergias: boolean;
  Tienedieta_especial: boolean;
  alcoholismo: string | null;
  alergico_medicamento: boolean;
  altura: number;
  apariencia_personal: string | null;
  cafeina: string | null;
  cirugias: string | null;
  comunicacion_no_verbal: string | null;
  comunicacion_verbal: string | null;
  continencia: string | null;
  cuidado_personal: string | null;
  dieta_especial: string | null;
  discapacidades: string | null;
  emer_medica: string;
  eps: string;
  estado_de_animo: string | null;
  fecha_ingreso: string;
  frecuencia_cardiaca: number;
  historial_cirugias: string;
  id_usuario: number;
  limitaciones: string | null;
  maltratado: string | null;
  maltrato: string | null;
  medicamentos_alergia: string | null;
  motivo_ingreso: string;
  observ_dietaEspecial: string;
  observ_otrasalergias: string;
  observaciones_iniciales: string;
  otras_alergias: string | null;
  diagnosticos: string | null;
  peso: number;
  presion_arterial: number;
  sustanciaspsico: string | null;
  tabaquismo: string | null;
  telefono_emermedica: string;
  temperatura_corporal: number;
  tipo_alimentacion: string | null;
  tipo_de_movilidad: string | null;
  tipo_de_sueno: string | null;
  tipo_sangre: string;
  porte_clinico?: string;
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
  diagnosticos: string;
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
  observaciones: string;
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
};

export type ActivityType = {
  id: number;
  tipo: string;
};

export type Login = {
  access_token: string;
  token_type: "bearer";
};

export type CreateFamilyMemberRequest = {
  userId?: number | string;
  family_member: Omit<FamilyMember, "id_acudiente">;
  kinship: { parentezco: string };
};

export type CreateContractRequest = {
  id_usuario: number;
  tipo_contrato: string;
  fecha_inicio: string;
  fecha_fin: string;
  facturar_contrato: boolean;
  servicios: {
    descripcion: string;
    fecha: string;
    fechas_servicio: { fecha: string }[];
    id_servicio: number;
    precio_por_dia: number;
  }[];
  impuestos?: number;
  descuentos?: number;
};

export type UpdateContractRequest = {
  id_contrato: number;
} & CreateContractRequest;

export type Contract = {
  id_contrato: number;
  id_usuario: number;
  facturar_contrato: boolean;
  fecha_fin: string;
  fecha_inicio: string;
  tipo_contrato: "Nuevo" | "Recurrente";
};

export type Service = {
  id_servicio_contratado: number;
  id_servicio: number;
  descripcion: string;
  fecha: string;
  fechas_servicio: { fecha: string }[];
  precio_por_dia: number;
};

export interface UserContractsResponse extends Contract {
  servicios: Service[];
}

export interface Bill {
  id_factura: number;
  numero_factura: string | null;
  id_contrato: number;
  fecha_emision: string;
  fecha_vencimiento?: string;
  total_factura: number;
  subtotal?: number;
  impuestos?: number;
  descuentos?: number;
  estado_factura?: string;
  observaciones?: string;
  pagos?: Payment[];
}

export type BillDetail = {
  id_detalle_factura: number;
  id_factura: number;
  id_servicio_contratado: number;
  cantidad: number;
  valor_unitario: number;
  subtotal_linea: number;
  impuestos_linea: number;
  descuentos_linea: number;
  descripcion_servicio?: string;
};

export type Payment = {
  id_pago: number;
  id_factura: number;
  id_metodo_pago: number;
  id_tipo_pago: number;
  fecha_pago: string;
  valor: number;
  metodo_pago?: {
    id_metodo_pago: number;
    nombre: string;
  };
  tipo_pago?: {
    id_tipo_pago: number;
    nombre: string;
  };
};

interface CalculateBillBody {
  service_ids: number[];
  quantities: number[];
  year: number;
}

export interface PaymentMethod {
  id_metodo_pago: number;
  nombre: string;
}

// =============================================================================
// TIPOS PARA EL MÓDULO DE CRONOGRAMA
// =============================================================================

export type CronogramaAsistencia = {
  id_cronograma: number;
  id_profesional: number;
  fecha: string;
  comentario: string;
  pacientes: CronogramaAsistenciaPaciente[];
};

export type CronogramaAsistenciaPaciente = {
  id_cronograma_paciente: number;
  id_usuario: number;
  id_contrato: number;
  estado_asistencia:
    | "PENDIENTE"
    | "ASISTIO"
    | "NO_ASISTIO"
    | "CANCELADO"
    | "REAGENDADO";
  requiere_transporte: boolean;
  observaciones?: string;
  nombres?: string;
  apellidos?: string;
  n_documento?: string;
  id_profesional?: number;
  transporte_info?: TransporteInfo;
};

export type CronogramaCreateRequest = {
  id_profesional: number;
  fecha: string;
  comentario: string;
  pacientes: number[];
};

export type ReagendarPacienteRequest = {
  id_cronograma_paciente: number;
  nueva_fecha: string;
};

export type UpdateEstadoAsistenciaRequest = {
  estado_asistencia: "PENDIENTE" | "ASISTIO" | "NO_ASISTIO" | "CANCELADO";
  observaciones?: string;
  nueva_fecha?: string;
};

export type PacientePorFecha = {
  id_cronograma_paciente: number;
  id_usuario: number;
  id_contrato: number;
  estado_asistencia: string;
  requiere_transporte: boolean;
  nombres: string;
  apellidos: string;
  n_documento: string;
  id_profesional: number;
  transporte_info?: TransporteInfo;
};

export type EventoCalendario = {
  type: "warning" | "success" | "error" | "processing" | "default";
  content: string;
  paciente?: CronogramaAsistenciaPaciente;
};

// ============================================================================
// TIPOS PARA EL SISTEMA DE TRANSPORTE
// ============================================================================

export type EstadoTransporte = "PENDIENTE" | "REALIZADO" | "CANCELADO";

export type CronogramaTransporte = {
  id_transporte: number;
  id_cronograma_paciente: number;
  direccion_recogida?: string;
  direccion_entrega?: string;
  hora_recogida?: string;
  hora_entrega?: string;
  estado: EstadoTransporte;
  observaciones?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
};

export type RutaTransporte = {
  id_transporte: number;
  id_cronograma_paciente: number;
  nombres: string;
  apellidos: string;
  n_documento: string;
  direccion_recogida?: string;
  direccion_entrega?: string;
  hora_recogida?: string;
  hora_entrega?: string;
  estado: EstadoTransporte;
  observaciones?: string;
};

export type RutaDiaria = {
  fecha: string;
  rutas: RutaTransporte[];
  total_pacientes: number;
  total_pendientes: number;
  total_realizados: number;
  total_cancelados: number;
};

export type CreateTransporteRequest = {
  id_cronograma_paciente: number;
  direccion_recogida?: string;
  direccion_entrega?: string;
  hora_recogida?: string;
  hora_entrega?: string;
  observaciones?: string;
};

export type UpdateTransporteRequest = {
  direccion_recogida?: string;
  direccion_entrega?: string;
  hora_recogida?: string;
  hora_entrega?: string;
  estado?: EstadoTransporte;
  observaciones?: string;
};

export type TransporteInfo = {
  id_transporte: number;
  direccion_recogida?: string;
  direccion_entrega?: string;
  hora_recogida?: string;
  hora_entrega?: string;
  estado: EstadoTransporte;
  observaciones?: string;
};

// Tipos para estadísticas de transporte
export type EstadisticasTransporte = {
  total_rutas: number;
  pendientes: number;
  realizadas: number;
  canceladas: number;
  porcentaje_completado: number;
};

// Tipos para filtros de transporte
export type FiltrosTransporte = {
  fecha?: string;
  estado?: EstadoTransporte;
  id_profesional?: number;
  requiere_transporte?: boolean;
};

// Tipos para notificaciones de transporte
export type NotificacionTransporte = {
  id: number;
  tipo: "info" | "warning" | "error" | "success";
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  id_transporte?: number;
  id_usuario?: number;
};
