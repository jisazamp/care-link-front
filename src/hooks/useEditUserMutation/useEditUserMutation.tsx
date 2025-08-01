import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { User } from "../../types";

const editUser = ({
  id,
  photoFile,
  user,
  hasEditedPhoto,
}: {
  id: number | string;
  photoFile?: File;
  user: Partial<User>;
  hasEditedPhoto: boolean;
}) => {
  const formData = new FormData();

  formData.append("user", JSON.stringify(user));

  if (photoFile && hasEditedPhoto) {
    formData.append("photo", photoFile);
  }

  return client.patch<{ data: User }>(`/api/users/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const useEditUserMutation = (id?: string | number) => {
  return useMutation({
    mutationKey: ["edit-user"],
    mutationFn: editUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-users"],
      });
      queryClient.invalidateQueries({
        queryKey: [`get-user-${id}`],
      });
    },
  });
};
