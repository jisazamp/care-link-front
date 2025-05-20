import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type {
  MedicalRecord,
  UserCare,
  UserIntervention,
  UserMedicine,
} from "../../types";

type CreateMedicalRecordType = {
  record: MedicalRecord;
  medicines: UserMedicine[];
  cares: UserCare[];
  interventions: UserIntervention[];
};

const createMedicalRecord = ({
  data,
  files,
}: {
  data: CreateMedicalRecordType;
  files?: File[];
}) => {
  const formData = new FormData();

  formData.append("record", JSON.stringify(data.record));

  if (data.medicines) {
    const cleanedMedicines = data.medicines.map(({ id, ...rest }) => rest);
    formData.append("medicines", JSON.stringify(cleanedMedicines));
  }

  if (data.cares) {
    const cleanedCares = data.cares.map(({ id, ...rest }) => rest);
    formData.append("cares", JSON.stringify(cleanedCares));
  }

  if (data.interventions) {
    const cleanedInterventions = data.interventions.map(
      ({ id, ...rest }) => rest,
    );
    formData.append("interventions", JSON.stringify(cleanedInterventions));
  }

  /* if (data.vaccines) {
    const cleanedVaccines = data.vaccines.map(({ id, ...rest }) => rest);
    formData.append("vaccines", JSON.stringify(cleanedVaccines));
  } */

  formData.append("vaccines", JSON.stringify([]));

  if (files) {
    for (const file of files) {
      formData.append("attachments", file);
    }
  }

  return client.post(`/api/users/${data.record.id_usuario}/record`, formData);
};

export const useCreateUserMedicalRecord = (id: number | string | undefined) => {
  return useMutation({
    mutationFn: createMedicalRecord,
    mutationKey: [`create-medical-record-${id}`],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`user-medical-record-${id}`],
      });
    },
  });
};
