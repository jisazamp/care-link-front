import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Professional } from "../../types";

const getProfessionals = () =>
  client.get<{ data: Professional[] }>("/api/professionals");

export const useGetProfessionals = () => {
  return useQuery({
    queryKey: ["professionals"],
    queryFn: getProfessionals,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
