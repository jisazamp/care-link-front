import type { AuthorizedUser } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const login = ({
  email,
  password,
}: Pick<AuthorizedUser, "email" | "password">) =>
  client.post("/api/login", { email, password });

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: login,
  });
};
