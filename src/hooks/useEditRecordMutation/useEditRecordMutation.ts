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
  attachments?: File[];
};

const editRecord = ({
  id,
  recordId,
  record,
  attachments,
}: {
  id: number;
  recordId: number;
  record: Partial<EditMedicalRecordType>;
  attachments?: File[];
}) => {
  record.vaccines = [];

  // Crear FormData para enviar archivos adjuntos
  const formData = new FormData();
  formData.append("record", JSON.stringify(record.record));
  formData.append("medicines", JSON.stringify(record.medicines));
  formData.append("cares", JSON.stringify(record.cares));
  formData.append("interventions", JSON.stringify(record.interventions));
  formData.append("vaccines", JSON.stringify(record.vaccines));

  if (attachments) {
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  }

  return client.patch(`/api/users/${id}/medical_record/${recordId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
  return client.patch(
    `/api/users/${id}/medical_record/${recordId}/simplified`,
    record,
  );
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
  return client.patch(
    `/api/users/${id}/medical_record/${recordId}/simplified`,
    record,
  );
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
      queryClient.invalidateQueries({
        queryKey: [`record-${recordId}`],
      });
    },
  });
};
