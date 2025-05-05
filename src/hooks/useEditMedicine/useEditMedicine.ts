import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UserMedicine } from "../../types";

const editMedicine = ({
  user: medicine,
  id,
}: {
  user: Partial<UserMedicine>;
  id: number | string;
}) => client.patch(`/api/user/treatment/${id}`, medicine);

export const useEditMedicine = () => {
  return useMutation({
    mutationKey: ["edit-medicine"],
    mutationFn: editMedicine,
  });
};
