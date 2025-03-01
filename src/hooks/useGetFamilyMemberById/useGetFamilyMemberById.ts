import { FamilyMemberResponse } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getFamilyMemberById = (id?: string | number) =>
  client.get<{ data: FamilyMemberResponse }>(`/api/family_members/${id}`);
export const useGetFamilyMemberById = (id?: string | number) => {
  return useQuery({
    enabled: !!id,
    queryFn: () => getFamilyMemberById(id),
    queryKey: [`get-family-member-${id}`],
    staleTime: Infinity
  });
};
