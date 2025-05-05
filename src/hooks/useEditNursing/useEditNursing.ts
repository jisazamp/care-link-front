import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UserCare } from "../../types";

const editCare = ({
  care,
  id,
}: {
  care: Partial<UserCare>;
  id: number | string;
}) => client.patch(`/api/user/nursing/${id}`, care);

export const useEditCare = () => {
  return useMutation({
    mutationKey: ["edit-care"],
    mutationFn: editCare,
  });
};
