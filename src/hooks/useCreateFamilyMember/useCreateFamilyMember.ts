import type { CreateFamilyMemberRequest } from "../../types";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

const createFamilyMember = async (request: CreateFamilyMemberRequest) => {
  const userId = request.userId;
  delete request.userId;
  return client.post(`/api/family_members/:id?id=${userId}`, request);
};

export const useCreateFamilyMember = (id: number | string | undefined) => {
  return useMutation({
    mutationFn: createFamilyMember,
    mutationKey: [`create-family-member-${id}`],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`get-user-${id}-family-members`],
      });
    },
  });
};
