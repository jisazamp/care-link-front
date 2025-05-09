import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { FamilyMember } from "../../types";

const updateFamilyMember = ({
  id,
  request,
}: {
  id: number | string;
  request: Partial<FamilyMember>;
}) => client.patch(`/api/family_members/${id}`, request);

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
