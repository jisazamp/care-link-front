import type { ActivityType } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getActivityTypes = () =>
  client.get<{ data: ActivityType[] }>("/api/activity_types");
export const useGetActivityTypes = () =>
  useQuery({
    queryKey: ["get-activity-types"],
    queryFn: getActivityTypes,
  });
