import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { FamilyMemberResponse } from "../../types";

const getFamilyMemberById = (id?: string | number) =>
  client.get<{ data: FamilyMemberResponse }>(`/api/family_members/${id}`);
export const useGetFamilyMemberById = (id?: string | number) => {
  return useQuery({
    enabled: !!id,
    queryFn: () => getFamilyMemberById(id),
    queryKey: [`get-family-member-${id}`],
  });
};
