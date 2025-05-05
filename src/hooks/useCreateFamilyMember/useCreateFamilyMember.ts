import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { CreateFamilyMemberRequest } from "../../types";

const createFamilyMember = async (request: CreateFamilyMemberRequest) => {
  const userId = request.userId;
  request.userId = undefined;
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
