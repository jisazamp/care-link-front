import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { MedicalReport } from "../../types";

const createMedicalReport = ({
  data,
  attachments,
}: {
  data: Partial<MedicalReport>;
  attachments?: any[];
}) => {
  const formData = new FormData();

  // Agregar datos del reporte
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  // Agregar archivos adjuntos
  if (attachments) {
    attachments.forEach((attachment) => {
      formData.append("attachments", attachment.originFileObj);
    });
  }

  return client.post("/api/medical_reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

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
