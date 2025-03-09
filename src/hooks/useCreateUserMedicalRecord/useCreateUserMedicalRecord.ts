import type {
  MedicalRecord,
  UserMedicine,
  UserCare,
  UserIntervention,
  UserVaccine,
} from "../../types";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

type CreateMedicalRecordType = {
  record: MedicalRecord;
  medicines: UserMedicine[];
  cares: UserCare[];
  interventions: UserIntervention[];
  vaccines: UserVaccine[];
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
    formData.append("medicines", JSON.stringify(data.medicines));
  }
  if (data.cares) {
    formData.append("cares", JSON.stringify(data.cares));
  }
  if (data.interventions) {
    formData.append("interventions", JSON.stringify(data.interventions));
  }
  if (data.vaccines) {
    formData.append("vaccines", JSON.stringify(data.vaccines));
  }
  if (files) {
    for (let file of files) {
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
