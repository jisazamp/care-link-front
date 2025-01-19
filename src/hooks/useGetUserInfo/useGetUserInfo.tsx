import type { AuthorizedUser } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getInfo = () =>
  client.get<{ data: Omit<AuthorizedUser, "password"> }>("/api/info");

export const useGetUserInfo = () => {
  return useQuery({
    queryKey: ["get-user-info"],
    queryFn: getInfo,
    staleTime: Infinity,
  });
};
