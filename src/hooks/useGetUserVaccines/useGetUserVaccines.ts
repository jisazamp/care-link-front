import type { UserVaccine } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getRecordVaccines = (recordId?: number) =>
  client.get<{ data: UserVaccine[] }>(`/api/record/${recordId}/vaccines`);

export const useGetRecordVaccines = (recordId?: number) => {
  return useQuery({
    queryKey: [`record-${recordId}-vaccines`],
    queryFn: () => getRecordVaccines(recordId),
    enabled: !!recordId,
  });
};
