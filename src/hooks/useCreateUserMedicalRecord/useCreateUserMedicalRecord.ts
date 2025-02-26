import type { MedicalRecord } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const createMedicalRecord = (record: MedicalRecord) => {
  return client.post(`/api/users/${record.id_usuario}/medical_record`, record);
};

export const useCreateUserMedicalRecord = (id: number | string | undefined) => {
  return useMutation({
    mutationFn: createMedicalRecord,
    mutationKey: [`create-medical-record-${id}`],
  });
};
