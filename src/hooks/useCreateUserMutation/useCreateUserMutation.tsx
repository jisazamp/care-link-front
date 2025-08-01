import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { User } from "../../types";

const createUser = (user: Partial<User>, photoFile?: File) => {
  const formData = new FormData();

  formData.append("user", JSON.stringify(user));

  if (photoFile) {
    formData.append("photo", photoFile);
  }

  return client.post<{ data: User }>("/api/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const useCreateUserMutation = () => {
  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: ({
      user,
      photoFile,
    }: {
      user: Partial<User>;
      photoFile?: File;
    }) => createUser(user, photoFile),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con usuarios para asegurar actualización completa
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
      queryClient.invalidateQueries({
        queryKey: ["get-users-with-home-visits"],
      });
      // También invalidar cualquier otra query que pueda estar relacionada con usuarios
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "get-users" ||
          query.queryKey[0] === "get-users-with-home-visits",
      });
    },
  });
};
