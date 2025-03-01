import { UserCare } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

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
