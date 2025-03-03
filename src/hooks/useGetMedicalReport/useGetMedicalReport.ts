import type { MedicalReport } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getReport = (id?: number | string) =>
  client.get<{ data: MedicalReport }>(`/api/medical_reports/${id}`);

export const useGetMedicalReport = (id?: number | string) =>
  useQuery({
    enabled: !!id,
    queryKey: [`get-medical-report-${id}`],
    staleTime: Infinity,
    queryFn: () => getReport(id),
  });
