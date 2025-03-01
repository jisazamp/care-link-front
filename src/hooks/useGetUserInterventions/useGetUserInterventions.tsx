import type { UserIntervention } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getRecordInterventions = (recordId?: number) =>
  client.get<{ data: UserIntervention[] }>(
    `/api/record/${recordId}/interventions`,
  );

export const useGetRecordInterventions = (recordId?: number) => {
  return useQuery({
    queryKey: [`record-${recordId}-interventions`],
    queryFn: () => getRecordInterventions(recordId),
    enabled: !!recordId,
    staleTime: Infinity
  });
};
