import type { ClinicalEvolution } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getClinicalEvolutions = (reportId?: number | string) =>
  client.get<{ data: ClinicalEvolution[] }>(
    `/api/reports/${reportId}/evolutions`,
  );

export const useGetClinicalEvolutions = (reportId?: number | string) => useQuery({
  enabled: !!reportId,
  queryKey: [`report-${reportId}-clinical-evolutions`],
  queryFn: () => getClinicalEvolutions(reportId),
})
