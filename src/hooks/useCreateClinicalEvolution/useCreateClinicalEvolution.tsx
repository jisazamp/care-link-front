import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { ClinicalEvolution } from "../../types";

const createClinicalEvolution = (
  data: Omit<ClinicalEvolution, "id_TipoReporte" | "profesional">,
) => client.post(`/api/reports/${data.id_reporteclinico}/evolutions`, data);

export const useCreateClinicalEvolution = (reportId?: number | string) =>
  useMutation({
    mutationKey: ["create-clinical-evolution"],
    mutationFn: createClinicalEvolution,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`report-${reportId}-clinical-evolutions`],
      });
      // También invalidar las consultas de evoluciones individuales
      queryClient.invalidateQueries({
        queryKey: ["clinical-evolution"],
      });
    },
  });
