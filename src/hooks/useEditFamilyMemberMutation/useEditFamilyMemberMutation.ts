import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { FamilyMember } from "../../types";

const updateFamilyMember = ({
  id,
  familiy_member_id,
  family_member,
  kinship,
}: {
  id: number | string;
  familiy_member_id: number | string;
  family_member: Partial<FamilyMember>;
  kinship: { parentezco: string };
}) =>
  client.patch(
    `/api/family_members/${id}?family_member_id=${familiy_member_id}`,
    {
      family_member,
      kinship,
    },
  );

export const useEditFamilyMemberMutation = (id?: number | string) => {
  return useMutation({
    mutationKey: ["edit-family-member"],
    mutationFn: updateFamilyMember,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`get-user-${id}-family-members`],
      });
    },
  });
};
