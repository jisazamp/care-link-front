import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const exportUserTemplate = () => {
  return client.get("/api/users/template/excel", {
    responseType: "blob",
  });
};

export const useExportUserTemplate = () => {
  return useMutation({
    mutationKey: ["export-user-template"],
    mutationFn: exportUserTemplate,
    onSuccess: (response) => {
      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "plantilla_usuarios_fundacion.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};