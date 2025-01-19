import { User } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const editUser = ({ user, id }: { user: Partial<User>; id: number | string }) =>
  client.patch(`/api/users/${id}`, user);
export const useEditUserMutation = () => {
  return useMutation({
    mutationKey: ["edit-user"],
    mutationFn: editUser,
  });
};
