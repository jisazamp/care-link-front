import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const deleteClinicalEvolution = (id: string | number) =>
  client.delete(`/api/evolutions/${id}`);

export const useDeleteClinicalEvolution = () =>
  useMutation({
    mutationKey: ["delete-clinical-evolution"],
    mutationFn: deleteClinicalEvolution,
  });
