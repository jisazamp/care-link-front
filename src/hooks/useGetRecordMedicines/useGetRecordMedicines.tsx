import type { UserMedicine } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getRecordMedicines = (recordId: number | undefined | null) =>
  client.get<{ data: UserMedicine[] }>(`/api/record/${recordId}/medicines`);

export const useGetRecordMedicines = (recordId: number | undefined | null) => {
  return useQuery({
    queryKey: [`record-${recordId}-medicines`],
    queryFn: () => getRecordMedicines(recordId),
    enabled: !!recordId,
    staleTime: Infinity
  });
};
