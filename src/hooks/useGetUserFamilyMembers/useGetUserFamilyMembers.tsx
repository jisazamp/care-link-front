import { FamilyMember } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getUserFamilyMembers = (id?: number | string) =>
  client.get<{ data: FamilyMember[] }>(`/api/users/${id}/family_members`);
export const useGetUserFamilyMembers = (id?: number | string) => {
  return useQuery({
    enabled: !!id,
    queryFn: () => getUserFamilyMembers(id),
    queryKey: [`get-user-${id}-family-members`],
  });
};
