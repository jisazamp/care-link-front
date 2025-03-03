import type { MedicalReport } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getUserMedicalReport = (id?: string | number) =>
  client.get<{ data: MedicalReport[] }>(`/api/user/${id}/medical_reports`);

export const useGetMedicalReports = (id?: string | number) => {
  return useQuery({
    enabled: !!id,
    queryKey: [`user-${id}-medical-reports`],
    staleTime: Infinity,
    queryFn: () => getUserMedicalReport(id),
  });
};
