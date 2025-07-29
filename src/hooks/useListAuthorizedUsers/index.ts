import { useQuery } from "@tanstack/react-query";
import { listAuthorizedUsers } from "../../services/authorized-users";

export const useListAuthorizedUsers = () => {
  const { data, isPending } = useQuery({
    queryKey: ["list-authorized-users"],
    queryFn: listAuthorizedUsers,
  });

  return { authorizedUsersData: data, isListAuthorizedUsersPending: isPending };
};
