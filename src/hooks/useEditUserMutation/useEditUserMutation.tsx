import { User } from "../../types";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

const editUser = ({ user, id }: { user: Partial<User>; id: number | string }) =>
  client.patch(`/api/users/${id}`, user);
export const useEditUserMutation = (id?: string | number) => {
  return useMutation({
    mutationKey: ["edit-user"],
    mutationFn: editUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-users"],
      });
      queryClient.invalidateQueries({
        queryKey: [`get-user-${id}`],
      });
    },
  });
};
