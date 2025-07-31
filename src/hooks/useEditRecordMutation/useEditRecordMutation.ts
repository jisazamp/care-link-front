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
  // Extraer los datos del record anidado y enviarlos en el formato correcto
  const {
    record: recordData,
    medicines,
    cares,
    interventions,
    vaccines,
  } = record;

  // Crear el payload en el formato que espera el backend
  const payload = {
    record: recordData, // El backend espera un campo 'record' con los datos de la historia clínica
    medicines: medicines || [],
    cares: cares || [],
    interventions: interventions || [],
    vaccines: vaccines || [],
  };

  return client.patch(`/api/users/${id}/medical_record/${recordId}`, payload);
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
  // Para el endpoint simplificado, solo necesitamos enviar el record
  const payload = {
    record: record, // El backend espera un campo 'record' con los datos de la historia clínica
  };

  return client.patch(
    `/api/users/${id}/medical_record/${recordId}/simplified`,
    payload,
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
