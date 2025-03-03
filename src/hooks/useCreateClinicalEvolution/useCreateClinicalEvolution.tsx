import type { ClinicalEvolution } from "../../types";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

const createClinicalEvolution = (
  data: Omit<ClinicalEvolution, "id_TipoReporte" | "profesional">
) => client.post(`/api/reports/${data.id_reporteclinico}/evolutions`, data);

export const useCreateClinicalEvolution = (reportId?: number | string) =>
  useMutation({
    mutationKey: ["create-clinical-evolution"],
    mutationFn: createClinicalEvolution,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`report-${reportId}-clinical-evolutions`],
      });
    },
  });
