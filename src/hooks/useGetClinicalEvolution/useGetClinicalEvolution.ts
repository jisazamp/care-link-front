import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { ClinicalEvolution } from "../../types";

const getClinicalEvolution = (evolutionId?: number | string) =>
  client.get<{ data: ClinicalEvolution }>(`/api/evolutions/${evolutionId}`);

export const useGetClinicalEvolution = (evolutionId?: number | string) =>
  useQuery({
    enabled: !!evolutionId,
    queryKey: [`clinical-evolution-${evolutionId}`],
    queryFn: () => getClinicalEvolution(evolutionId),
  });
