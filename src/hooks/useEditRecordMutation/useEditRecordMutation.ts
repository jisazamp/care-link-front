import type {
  MedicalRecord,
  UserMedicine,
  UserCare,
  UserIntervention,
  UserVaccine,
} from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";

type EditMedicalRecordType = {
  record: MedicalRecord;
  medicines: UserMedicine[];
  cares: UserCare[];
  interventions: UserIntervention[];
  vaccines: UserVaccine[];
};

const editRecord = ({
  id,
  recordId,
  record,
}: {
  id: number;
  recordId: number;
  record: Partial<EditMedicalRecordType>;
}) => client.patch(`/api/users/${id}/medical_record/${recordId}`, record);

interface UseEditRecordMutationProps {
  id?: string | number;
  recordId?: string | number;
}

export const useEditRecordMutation = ({
  id,
  recordId,
}: UseEditRecordMutationProps) => {
  return useMutation({
    mutationKey: ["edit-record"],
    mutationFn: editRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`user-medical-record-${id}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`record-${recordId}-vaccines`],
      });
      queryClient.invalidateQueries({
        queryKey: [`record-${recordId}-medicines`],
      });
      queryClient.invalidateQueries({
        queryKey: [`record-${recordId}-cares`],
      });
      queryClient.invalidateQueries({
        queryKey: [`record-${recordId}-interventions`],
      });
    },
  });
};
