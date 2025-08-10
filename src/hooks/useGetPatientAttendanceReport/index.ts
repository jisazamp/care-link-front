import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface PatientAttendanceDetail {
  id_cronograma_paciente: number;
  fecha: string;
  estado_asistencia: string;
  profesional_nombre: string;
  profesional_apellidos: string;
  observaciones: string;
  requiere_transporte: boolean;
}

interface PatientAttendanceStats {
  total_agendado: number;
  total_asistio: number;
  total_no_asistio: number;
  total_pendiente: number;
  total_cancelado: number;
  porcentaje_asistencia: number;
  periodo_inicio: string;
  periodo_fin: string;
}

interface PatientAttendanceReport {
  paciente: {
    id_usuario: number;
    nombres: string;
    apellidos: string;
    n_documento: string;
  };
  estadisticas: PatientAttendanceStats;
  detalles: PatientAttendanceDetail[];
}

interface PatientAttendanceReportResponse {
  data: PatientAttendanceReport;
  status_code: number;
  message: string;
  error: null;
}

const getPatientAttendanceReport = (
  patientId: number,
  startDate?: string,
  endDate?: string,
) => {
  const params = new URLSearchParams();
  if (startDate) params.append("fecha_inicio", startDate);
  if (endDate) params.append("fecha_fin", endDate);

  const queryString = params.toString();
  const url = `/api/cronograma_asistencia/paciente/${patientId}/informe${queryString ? `?${queryString}` : ""}`;

  return client.get<PatientAttendanceReportResponse>(url);
};

export const useGetPatientAttendanceReport = (
  patientId: number,
  startDate?: string,
  endDate?: string,
  enabled: boolean = true,
) =>
  useQuery({
    queryKey: [
      `patient-attendance-report-${patientId}-${startDate}-${endDate}`,
    ],
    queryFn: () => getPatientAttendanceReport(patientId, startDate, endDate),
    enabled: enabled && !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

