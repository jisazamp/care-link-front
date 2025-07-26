import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type {
  MedicalRecord,
  UserCare,
  UserIntervention,
  UserMedicine,
  UserVaccine,
} from "../../types";

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
}) => {
  record.vaccines = [];
  return client.patch(`/api/users/${id}/medical_record/${recordId}`, record);
};

// Simplified edit function for home visit medical records
const editSimplifiedRecord = ({
  id,
  recordId,
  record,
}: {
  id: number;
  recordId: number;
  record: Partial<MedicalRecord>;
}) => {
  return client.patch(`/api/users/${id}/medical_record/${recordId}`, record);
};

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

// Simplified edit hook for home visit medical records
export const useEditSimplifiedRecordMutation = ({
  id,
  recordId,
}: UseEditRecordMutationProps) => {
  return useMutation({
    mutationKey: ["edit-simplified-record"],
    mutationFn: editSimplifiedRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`user-medical-record-${id}`],
      });
    },
  });
};
