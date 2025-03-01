import type { User } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getUsers = () => client.get<{ data: User[] }>("/api/users");
export const useGetUsers = () => {
  return useQuery({
    queryFn: getUsers,
    queryKey: ["get-users"],
    staleTime: Infinity
  });
};
