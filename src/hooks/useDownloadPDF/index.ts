import { useState } from "react";
import { useAuthStore } from "../../store/auth";
import { client } from "../../api/client";

interface UseDownloadPDFReturn {
  downloadPDF: (facturaId: number) => Promise<void>;
  isDownloading: boolean;
}

export const useDownloadPDF = (): UseDownloadPDFReturn => {
  const [isDownloading, setIsDownloading] = useState(false);
  const jwtToken = useAuthStore((state) => state.jwtToken);

  const downloadPDF = async (facturaId: number): Promise<void> => {
    if (!facturaId) {
      throw new Error("ID de factura no válido");
    }

    if (!jwtToken) {
      throw new Error("Debes iniciar sesión para descargar el PDF");
    }

    setIsDownloading(true);

    try {
      // Usar el cliente axios configurado que ya maneja la autenticación
      const response = await client.get(`/api/facturas/${facturaId}/pdf`, {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
        },
      });

      // Verificar que la respuesta sea un PDF
      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("La respuesta no es un archivo PDF válido");
      }

      // Crear y descargar el archivo
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `factura_${facturaId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("✅ PDF descargado exitosamente");
    } catch (error: any) {
      console.error("❌ Error descargando PDF:", error);

      // Manejar errores específicos
      if (error.response?.status === 401) {
        throw new Error(
          "Sesión expirada. Por favor, inicie sesión nuevamente.",
        );
      } else if (error.response?.status === 404) {
        throw new Error("Factura no encontrada");
      } else if (error.response?.status === 500) {
        throw new Error("Error del servidor al generar el PDF");
      } else {
        throw new Error(error.message || "Error inesperado al descargar PDF");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadPDF,
    isDownloading,
  };
};
