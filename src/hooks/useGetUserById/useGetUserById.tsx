import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { User } from "../../types";

const getUser = async (id: string | undefined) =>
  await client.get<{ data: User }>(`/api/users/${id}`);

export const useGetUserById = (id: string | undefined) => {
  return useQuery({
    queryKey: [`get-user-${id}`, id],
    queryFn: () => getUser(id),
    enabled: !!id,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
