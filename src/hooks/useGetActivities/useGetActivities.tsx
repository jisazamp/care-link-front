import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Activity } from "../../types";

const getActivities = () => client.get<{ data: Activity[] }>("/api/activities");
export const useGetActivities = () =>
  useQuery({ queryKey: ["get-activities"], queryFn: getActivities });
