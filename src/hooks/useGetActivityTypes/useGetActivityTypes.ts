import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { ActivityType } from "../../types";

const getActivityTypes = () =>
  client.get<{ data: ActivityType[] }>("/api/activity_types");
export const useGetActivityTypes = () =>
  useQuery({
    queryKey: ["get-activity-types"],
    queryFn: getActivityTypes,
  });
