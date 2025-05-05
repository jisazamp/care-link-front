import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Activity } from "../../types";

const getActivityById = (id?: number | string) =>
  client.get<{ data: Activity }>(`/api/activities/${id}`);
export const useGetActivityById = (id?: number | string) =>
  useQuery({
    enabled: !!id,
    queryKey: [`get-activity-${id}`],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: () => getActivityById(id),
  });
