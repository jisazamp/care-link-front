import type { AuthorizedUser, Login } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth";

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
      setJwtToken(data.data.data.access_token);
    },
  });
};
