import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Activity } from "../../types";

const getUpcomingActivities = () =>
  client.get<{ data: Activity[] }>("/api/activities-upcoming");
export const useGetUpcomingActivities = () =>
  useQuery({
    queryKey: ["get-upcoming-activities"],
    queryFn: getUpcomingActivities,
  });
