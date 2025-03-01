import { MedicalRecord } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";

const editRecord = ({
  id,
  recordId,
  record,
}: {
  id: number;
  recordId: number;
  record: Partial<MedicalRecord>;
}) => client.patch(`/api/users/${id}/medical_record/${recordId}`, record);

export const useEditRecordMutation = (id?: string | number) => {
  return useMutation({
    mutationKey: ["edit-record"],
    mutationFn: editRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`user-medical-record-${id}`, ''],
      });
    },
  });
};
