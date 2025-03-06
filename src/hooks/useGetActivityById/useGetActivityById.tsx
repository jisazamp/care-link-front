import { client } from "../../api/client";
import type { Activity } from "../../types";
import { useQuery } from "@tanstack/react-query";

const getActivityById = (id?: number | string) =>
  client.get<{ data: Activity }>(`/api/activities/${id}`);
export const useGetActivityById = (id?: number | string) =>
  useQuery({
    enabled: !!id,
    queryKey: [`get-activity-${id}`],
    staleTime: Infinity,
    queryFn: () => getActivityById(id),
  });
