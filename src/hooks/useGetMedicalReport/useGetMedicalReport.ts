import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { MedicalReport } from "../../types";

const getReport = (id?: number | string) =>
  client.get<{ data: MedicalReport }>(`/api/medical_reports/${id}`);

export const useGetMedicalReport = (id?: number | string) =>
  useQuery({
    enabled: !!id,
    queryKey: [`get-medical-report-${id}`],
    staleTime: 0, // Cambiar a 0 para que siempre se actualice cuando se invalide
    queryFn: () => getReport(id),
  });
