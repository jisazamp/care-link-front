import { useMutation } from "@tanstack/react-query";
import { updateAuthorizedUser } from "../../services/authorized-users";

export const useUpdateAuthorizedUser = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: updateAuthorizedUser,
  });

  return {
    updateAuthorizedUserFn: mutate,
    isPendingUpdateAuthorizedUser: isPending,
  };
};
