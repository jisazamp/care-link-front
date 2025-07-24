import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { User } from "../../types";

const getUsersWithHomeVisits = () => client.get<{ data: User[] }>("/api/users/home-visits");

export const useGetUsersWithHomeVisits = () => {
  return useQuery({
    queryFn: getUsersWithHomeVisits,
    queryKey: ["get-users-with-home-visits"],
    staleTime: Number.POSITIVE_INFINITY,
  });
}; 