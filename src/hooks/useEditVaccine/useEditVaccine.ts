import { UserVaccine } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const editVaccine = ({
  vaccine,
  id,
}: {
  vaccine: Partial<UserVaccine>;
  id: number | string;
}) => client.patch(`/api/user/vaccine/${id}`, vaccine);

export const useEditVaccine = () => {
  return useMutation({
    mutationKey: ["edit-vaccine"],
    mutationFn: editVaccine,
  });
};
