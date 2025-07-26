import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { HomeVisit } from "../../types";

interface HomeVisitsResponse {
  data: HomeVisit[];
  message: string;
  success: boolean;
}

const getUserHomeVisits = (userId: number | string) =>
  client.get<HomeVisitsResponse>(`/api/users/${userId}/home-visits`);

export const useGetUserHomeVisits = (userId: number | string | undefined) => {
  return useQuery({
    queryKey: ["user-home-visits", userId],
    queryFn: () => getUserHomeVisits(userId!),
    enabled: !!userId,
  });
};
