import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { MedicalRecord } from "../../types";

const getUserMedicalRecord = (id: number | string | undefined) =>
  client.get<{ data: MedicalRecord | null }>(`/api/users/${id}/medical_record`);

export const useGetUserMedicalRecord = (id: number | string | undefined) => {
  return useQuery({
    enabled: !!id,
    queryKey: [`user-medical-record-${id}`],
    queryFn: () => getUserMedicalRecord(id),
    staleTime: Number.POSITIVE_INFINITY,
  });
};
