import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const deleteClinicalEvolution = (id: string | number) =>
  client.delete(`/api/evolutions/${id}`);

export const useDeleteClinicalEvolution = () =>
  useMutation({
    mutationKey: ["delete-clinical-evolution"],
    mutationFn: deleteClinicalEvolution,
  });
