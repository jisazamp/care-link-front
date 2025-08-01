import { useMutation } from "@tanstack/react-query";
import { createAuthorizedUser } from "../../services/authorized-users";

export const useCreateAuthorizedUser = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: createAuthorizedUser,
  });
  return {
    createAuthorizedUserFn: mutate,
    isPendingCreateAuthorizedUser: isPending,
  };
};
