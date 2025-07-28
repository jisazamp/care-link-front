import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { MedicalRecord } from "../../types";

interface UpdateMedicalRecordParams {
  userId: number;
  recordId: number;
  data: Partial<MedicalRecord>;
}

const updateMedicalRecord = ({
  userId,
  recordId,
  data,
}: UpdateMedicalRecordParams) =>
  client.patch(
    `/api/users/${userId}/medical_record/${recordId}/simplified`,
    data,
  );

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMedicalRecord,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`user-medical-record-${variables.userId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`get-user-medical-record-${variables.userId}`],
      });
    },
  });
};
