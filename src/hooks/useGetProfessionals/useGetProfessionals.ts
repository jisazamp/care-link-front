import type { Professional } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getProfessionals = () =>
  client.get<{ data: Professional[] }>("/api/professionals");

export const useGetProfessionals = () => {
  return useQuery({
    queryKey: ["professionals"],
    queryFn: getProfessionals,
    staleTime: Infinity
  });
};
