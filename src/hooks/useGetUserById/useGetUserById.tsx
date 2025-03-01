import type { User } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getUser = async (id: string | undefined) =>
  await client.get<{ data: User }>(`/api/users/${id}`);

export const useGetUserById = (id: string | undefined) => {
  return useQuery({
    queryKey: [`get-user-${id}`, id],
    queryFn: () => getUser(id),
    enabled: !!id,
    staleTime: Infinity
  });
};
