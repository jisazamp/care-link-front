import type { User } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const createUser = (user: Partial<User>) =>
  client.post<{ data: User }>("/api/users", user);
export const useCreateUserMutation = () => {
  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: createUser,
  });
};
