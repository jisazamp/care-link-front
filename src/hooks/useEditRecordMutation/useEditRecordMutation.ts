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
  // Extraer los datos del record anidado
  const {
    record: recordData,
    medicines,
    cares,
    interventions,
    vaccines,
  } = record;

  // Crear FormData para enviar como multipart/form-data
  const formData = new FormData();

  // Agregar el record como JSON string
  if (recordData) {
    formData.append("record", JSON.stringify(recordData));
  }

  // Agregar las listas como JSON strings
  if (medicines) {
    formData.append("medicines", JSON.stringify(medicines));
  } else {
    formData.append("medicines", JSON.stringify([]));
  }

  if (cares) {
    formData.append("cares", JSON.stringify(cares));
  } else {
    formData.append("cares", JSON.stringify([]));
  }

  if (interventions) {
    formData.append("interventions", JSON.stringify(interventions));
  } else {
    formData.append("interventions", JSON.stringify([]));
  }

  if (vaccines) {
    formData.append("vaccines", JSON.stringify(vaccines));
  } else {
    formData.append("vaccines", JSON.stringify([]));
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
  // Crear FormData para enviar como multipart/form-data
  const formData = new FormData();

  // Agregar el record como JSON string
  if (record) {
    formData.append("record", JSON.stringify(record));
  }

  return client.patch(
    `/api/users/${id}/medical_record/${recordId}/simplified`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
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
