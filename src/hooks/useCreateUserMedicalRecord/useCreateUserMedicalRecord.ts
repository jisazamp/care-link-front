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

const createMedicalRecord = (data: CreateMedicalRecordType) => {
  return client.post(`/api/users/${data.record.id_usuario}/record`, data);
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
