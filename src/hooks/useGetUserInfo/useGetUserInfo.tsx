import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { AuthorizedUser } from "../../types";

const getInfo = () =>
  client.get<{ data: Omit<AuthorizedUser, "password"> }>("/api/info");

export const useGetUserInfo = () => {
  return useQuery({
    queryKey: ["get-user-info"],
    queryFn: getInfo,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
