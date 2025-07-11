import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Contract } from "../../types";

interface CreateContractRequest {
  id_usuario: number;
  tipo_contrato: string;
  fecha_inicio: string;
  fecha_fin: string;
  facturar_contrato: boolean;
  servicios: Array<{
    id_servicio: number;
    fecha: string;
    descripcion: string;
    precio_por_dia: number;
    fechas_servicio: Array<{
      fecha: string;
    }>;
  }>;
  impuestos?: number;
  descuentos?: number;
}

interface CreateContractResponse {
  data: Contract;
  message: string;
  success: boolean;
}

const createContract = (data: CreateContractRequest) =>
  client.post<CreateContractResponse>("/api/contratos/", data);

export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-contract"],
    mutationFn: createContract,
    onSuccess: (response) => {
      // Invalidar queries relacionadas con contratos
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["user-contracts"] });

      // Mostrar mensaje de éxito o error según la respuesta
      const data = response.data;
      if (data.success) {
        console.log("✅ Contrato creado exitosamente:", data.message);
      } else {
        console.error("❌ Error al crear contrato:", data.message);
      }
    },
    onError: (error: any) => {
      // Manejar errores específicos como doble agendamiento
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "Error de validación";
        console.error("❌ Error de validación:", errorMessage);
      } else {
        console.error("❌ Error inesperado:", error);
      }
    },
  });
};
