import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";

const deleteFamilyMember = (id: number) =>
  client.delete(`/api/family_members/${id}`);

export const useDeleteFamilyMemberMutation = (id?: number | string) => {
  return useMutation({
    mutationFn: deleteFamilyMember,
    mutationKey: ["delete-family-member"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`get-user-${id}-family-members`],
      });
    },
  });
};
