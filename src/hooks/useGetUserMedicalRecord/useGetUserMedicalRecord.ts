import type { MedicalRecord } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getUserMedicalRecord = (id: number | string | undefined) =>
  client.get<{ data: MedicalRecord | null }>(`/api/users/${id}/medical_record`);

export const useGetUserMedicalRecord = (id: number | string | undefined) => {
  return useQuery({
    enabled: !!id,
    queryFn: () => getUserMedicalRecord(id),
    queryKey: [`user-medical-record-${id}`],
  });
};
