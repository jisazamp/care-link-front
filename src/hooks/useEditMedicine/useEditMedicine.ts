import { UserMedicine } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

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
