import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";

const importUsers = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return client.post<{
    data: {
      success: Array<{
        row: number;
        user_id: number;
        nombre: string;
      }>;
      errors: Array<{
        row: number;
        error: string;
      }>;
      total_processed: number;
      total_success: number;
      total_errors: number;
    };
    message: string;
  }>("/api/users/import/excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const useImportUsers = () => {
  return useMutation({
    mutationKey: ["import-users"],
    mutationFn: importUsers,
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con usuarios
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
      queryClient.invalidateQueries({ queryKey: ["get-users-with-home-visits"] });
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === "get-users" || 
          query.queryKey[0] === "get-users-with-home-visits"
      });
    },
  });
};