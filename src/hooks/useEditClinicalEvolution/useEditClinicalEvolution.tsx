import type { ClinicalEvolution } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const editEvolution = ({
  data,
  evolutionId,
}: {
  data: Partial<ClinicalEvolution>;
  evolutionId: number;
}) => client.patch(`/api/evolutions/${evolutionId}`, data);

export const useEditClinicalEvolution = () =>
  useMutation({
    mutationFn: editEvolution,
    mutationKey: ["edit-clinical-evolution"],
  });
