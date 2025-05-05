import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UserVaccine } from "../../types";

const getRecordVaccines = (recordId?: number) =>
  client.get<{ data: UserVaccine[] }>(`/api/record/${recordId}/vaccines`);

export const useGetRecordVaccines = (recordId?: number) => {
  return useQuery({
    queryKey: [`record-${recordId}-vaccines`],
    queryFn: () => getRecordVaccines(recordId),
    enabled: !!recordId,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
