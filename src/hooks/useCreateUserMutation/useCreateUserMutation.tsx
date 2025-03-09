import type { User } from "../../types";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

const createUser = (user: Partial<User>, photoFile?: File) => {
  const formData = new FormData();

  formData.append("user", JSON.stringify(user))

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
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
    },
  });
};
