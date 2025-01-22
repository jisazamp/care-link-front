import type { FamilyMember } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const updateFamilyMember = ({
  id,
  request,
}: {
  id: number | string;
  request: Partial<FamilyMember>;
}) => client.patch(`/api/family_members/${id}`, request);
export const useEditFamilyMemberMutation = () => {
  return useMutation({
    mutationKey: ["edit-family-member"],
    mutationFn: updateFamilyMember,
  });
};
