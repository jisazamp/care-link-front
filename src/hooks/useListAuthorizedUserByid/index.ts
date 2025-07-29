import { useQuery } from "@tanstack/react-query";
import { listAuthorizedUserById } from "../../services/authorized-users";

export const useListAuthorizedUserById = (userId: number) => {
  const { data, isLoading } = useQuery({
    enabled: !!userId,
    queryKey: [`list-authorized-user-${userId}`],
    queryFn: () => listAuthorizedUserById(userId),
  });

  return { authorizedUserData: data, isPendingAuthorizedUser: isLoading };
};
