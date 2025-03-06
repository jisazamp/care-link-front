import type { Activity } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getActivities = () => client.get<{ data: Activity[] }>('/api/activities')
export const useGetActivities = () => useQuery({ queryKey: ['get-activities'], queryFn: getActivities })
