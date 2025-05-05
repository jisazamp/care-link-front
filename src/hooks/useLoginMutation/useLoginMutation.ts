import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { useAuthStore } from "../../store/auth";
import type { AuthorizedUser, Login } from "../../types";

const login = ({
  email,
  password,
}: Pick<AuthorizedUser, "email" | "password">) =>
  client.post<{ data: Login }>("/api/login", { email, password });

export const useLoginMutation = () => {
  const setJwtToken = useAuthStore((state) => state.setJwtToken);

  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      if (data.data.data.access_token) {
        setJwtToken(data.data.data.access_token);
      }
    },
  });
};
