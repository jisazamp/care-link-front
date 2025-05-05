import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { MedicalReport } from "../../types";

const createMedicalReport = ({ data }: { data: Partial<MedicalReport> }) =>
  client.post("/api/medical_reports", data);

export const useCreateMedicalReport = (id?: string | number) => {
  return useMutation({
    mutationFn: createMedicalReport,
    mutationKey: ["create-medical-report"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`user-${id}-medical-reports`],
      });
    },
  });
};
