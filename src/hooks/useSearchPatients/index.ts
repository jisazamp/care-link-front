import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface PatientSearchResult {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  n_documento: string;
  total_agendado: number;
  total_asistio: number;
  total_no_asistio: number;
  total_pendiente: number;
  porcentaje_asistencia: number;
}

interface PatientSearchResponse {
  data: PatientSearchResult[];
  status_code: number;
  message: string;
  error: null;
}

const searchPatients = (query: string) =>
  client.get<PatientSearchResponse>(
    `/api/patients/search?q=${encodeURIComponent(query)}`,
  );

export const useSearchPatients = (query: string, enabled: boolean = true) =>
  useQuery({
    queryKey: [`patient-search-${query}`],
    queryFn: () => searchPatients(query),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

