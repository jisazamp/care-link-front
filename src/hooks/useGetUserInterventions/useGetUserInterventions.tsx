import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UserIntervention } from "../../types";

const getRecordInterventions = (recordId?: number) =>
  client.get<{ data: UserIntervention[] }>(
    `/api/record/${recordId}/interventions`,
  );

export const useGetRecordInterventions = (recordId?: number) => {
  return useQuery({
    queryKey: [`record-${recordId}-interventions`],
    queryFn: () => getRecordInterventions(recordId),
    enabled: !!recordId,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
