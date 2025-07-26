import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";

interface ServiceRate {
  id: number;
  id_servicio: number;
  anio: number;
  precio_por_dia: number;
}

interface UpdateServiceRatesRequest {
  TarifasServicioPorAnio: ServiceRate[];
}

interface ServiceRatesResponse {
  data: {
    TarifasServicioPorAnio: ServiceRate[];
  };
  message: string;
  success: boolean;
}

const updateServiceRates = async (data: UpdateServiceRatesRequest) => {
  const response = await client.patch<ServiceRatesResponse>(
    "/api/tarifas-servicios",
    data,
  );
  return response.data;
};

export const useUpdateServiceRates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-service-rates"],
    mutationFn: updateServiceRates,
    onSuccess: () => {
      // Invalidar la query de tarifas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["service-rates"] });
      console.log(" Tarifas de servicios actualizadas exitosamente");
    },
    onError: (error: any) => {
      console.error(" Error al actualizar tarifas de servicios:", error);
    },
  });
};
