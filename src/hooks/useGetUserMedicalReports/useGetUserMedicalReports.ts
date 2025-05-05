import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { MedicalReport } from "../../types";

const getUserMedicalReport = (id?: string | number) =>
  client.get<{ data: MedicalReport[] }>(`/api/user/${id}/medical_reports`);

export const useGetMedicalReports = (id?: string | number) => {
  return useQuery({
    enabled: !!id,
    queryKey: [`user-${id}-medical-reports`],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () => getUserMedicalReport(id),
  });
};
