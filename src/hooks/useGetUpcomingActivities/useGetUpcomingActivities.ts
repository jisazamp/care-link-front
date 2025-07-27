import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Activity } from "../../types";

interface UpcomingActivitiesResponse {
  data: Activity[];
  message: string;
  success: boolean;
}

const getUpcomingActivities = () =>
  client.get<UpcomingActivitiesResponse>("/api/activities-upcoming");

export const useGetUpcomingActivities = () =>
  useQuery({
    queryKey: ["get-upcoming-activities"],
    queryFn: getUpcomingActivities,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000,
  });
