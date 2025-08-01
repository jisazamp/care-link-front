import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

export const useGetClinicalEvolution = (evolutionId?: string | number) => {
  return useQuery({
    queryKey: ["clinical-evolution", evolutionId],
    queryFn: () => client.get(`/api/evolutions/${evolutionId}`),
    enabled: !!evolutionId,
  });
}; 