import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { MedicalReport } from "../../types";

interface UpdateMedicalReportData {
  reportId: string | number;
  data: Partial<MedicalReport>;
}

export const useUpdateMedicalReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, data }: UpdateMedicalReportData) => {
      const response = await client.patch(
        `/api/medical_reports/${reportId}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: ["medical-reports"],
      });
      queryClient.invalidateQueries({
        queryKey: [`get-medical-report-${variables.reportId}`],
      });
    },
  });
};
