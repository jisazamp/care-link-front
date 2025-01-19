import { client } from "../../api/client";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

const deleteUser = (id: number | null) => client.delete(`/api/users/${id}`);
export const useDeleteUserMutation = () => {
  return useMutation({
    mutationKey: [`delete-user`],
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
    },
  });
};
