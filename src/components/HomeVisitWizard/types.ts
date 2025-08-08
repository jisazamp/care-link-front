import { z } from "zod";

// Schema para el wizard completo
export const wizardSchema = z.object({
  // Paso 1: Datos de la visita
  fecha_visita: z.any(),
  hora_visita: z.any(),
  profesional_asignado: z.number().min(1, "El profesional es requerido"),
  observaciones: z.string().optional(),

  // Paso 2: Datos de facturación
  impuestos: z.number().default(0),
  descuentos: z.number().default(0),
  fecha_vencimiento: z.any().optional(),
  observaciones_factura: z.string().optional(),
  numero_factura: z.string().optional(),

  // Pagos
  payments: z.array(z.any()).default([]),
});

export type WizardFormValues = z.infer<typeof wizardSchema>;

// Tipos para los pasos del wizard
export interface HomeVisitStepProps {
  user: any;
  isEditing: boolean;
  existingVisit?: any;
  onValidChange: (isValid: boolean) => void;
}

export interface BillingStepProps {
  isEditing: boolean;
  onValidChange: (isValid: boolean) => void;
}

// Tipos para los componentes de utilidad
export interface LoadingStateProps {
  isLoading: boolean;
  isEditing: boolean;
  hasError: boolean;
  onRetry?: () => void;
  onCancel: () => void;
}

export interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceedToNext: boolean;
  canFinalize: boolean;
  isSubmitting: boolean;
  isEditing: boolean;
  onNext: () => void;
  onBack: () => void;
  onFinalize: () => void;
}

// Tipos para los estados de visita
export type VisitaEstado =
  | "PENDIENTE"
  | "PENDIENTE DE PROGRAMACIÓN"
  | "REALIZADA"
  | "CANCELADA"
  | "REPROGRAMADA";

// Tipos para los datos de visita
export interface VisitaData {
  id_visitadomiciliaria: number;
  fecha_visita?: string;
  hora_visita?: string;
  direccion_visita: string;
  telefono_visita: string;
  valor_dia: number;
  observaciones?: string;
  estado_visita?: VisitaEstado;
  profesional_asignado?: {
    id_profesional: number;
    nombres: string;
    apellidos: string;
    especialidad: string;
  };
}

// Tipos para los datos de usuario
export interface UserData {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  email: string;
}

// Tipos para los datos de facturación
export interface BillingData {
  impuestos: number;
  descuentos: number;
  fecha_vencimiento?: string;
  observaciones_factura?: string;
  numero_factura?: string;
  payments: PaymentData[];
}

export interface PaymentData {
  paymentMethod: number;
  paymentDate: string;
  amount: number;
  id_tipo_pago: number;
}

// Tipos para los datos de profesional
export interface ProfessionalData {
  id_profesional: number;
  nombres: string;
  apellidos: string;
  especialidad: string;
  telefono?: string;
  email?: string;
}
