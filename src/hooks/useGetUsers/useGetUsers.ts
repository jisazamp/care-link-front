import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { User } from "../../types";

const getUsers = () => client.get<{ data: User[] }>("/api/users");
export const useGetUsers = () => {
  return useQuery({
    queryFn: getUsers,
    queryKey: ["get-users"],
    staleTime: Number.POSITIVE_INFINITY,
  });
};
