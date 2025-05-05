import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UserVaccine } from "../../types";

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
