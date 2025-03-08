import { client } from "../../api/client";
import type { Activity } from "../../types";
import { useQuery } from "@tanstack/react-query";

const getUpcomingActivities = () =>
  client.get<{ data: Activity[] }>("/api/activities-upcoming");
export const useGetUpcomingActivities = () =>
  useQuery({
    queryKey: ["get-upcoming-activities"],
    queryFn: getUpcomingActivities,
  });
