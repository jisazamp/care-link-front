import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";
import type { Bill } from "../types";

const getFacturas = async (contratoId?: number) => {
  console.log("🔍 useGetFacturas - Iniciando petición");
  console.log("📋 Contrato ID:", contratoId);

  try {
    const res = contratoId
      ? await client.get<any>(`/api/contratos/${contratoId}/facturas`)
      : await client.get<any>(`/api/facturas`);

    console.log("📊 Respuesta del servidor:", res);

    // Soporta ambas estructuras: { data: Bill[] } y { data: { data: Bill[] } }
    let facturas: Bill[] = [];

    if (Array.isArray(res?.data)) {
      facturas = res.data;
    } else if (Array.isArray(res?.data?.data)) {
      facturas = res.data.data;
    } else if (res?.data?.data && Array.isArray(res.data.data)) {
      facturas = res.data.data;
    }

    console.log("✅ Facturas procesadas:", facturas);
    return facturas;
  } catch (error) {
    console.error("❌ Error en useGetFacturas:", error);
    throw error;
  }
};

export const useGetFacturas = (contratoId?: number) =>
  useQuery({
    queryKey: contratoId ? ["facturas", contratoId] : ["facturas"],
    queryFn: () => getFacturas(contratoId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
