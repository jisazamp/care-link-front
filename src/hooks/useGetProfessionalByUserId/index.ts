import { useQuery } from "@tanstack/react-query";
import { getProfessionalByUserId } from "../../services/professionals";
import type { Professional } from "../../types";

export const useGetProfessionalByUserId = (userId: number) => {
  const { data, isLoading } = useQuery<{ data: { data: Professional } }>({
    enabled: !!userId,
    queryKey: [`get-professional-${userId}`],
    queryFn: () => getProfessionalByUserId(userId),
  });

  return { professionalData: data, isLoadingProfessional: isLoading };
};
