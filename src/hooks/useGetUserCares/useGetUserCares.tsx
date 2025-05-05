import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UserCare } from "../../types";

const getRecordCares = (recordId?: number) =>
  client.get<{ data: UserCare[] }>(`/api/record/${recordId}/cares`);

export const useGetRecordCares = (recordId?: number) => {
  return useQuery({
    queryKey: [`record-${recordId}-cares`],
    queryFn: () => getRecordCares(recordId),
    enabled: !!recordId,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
