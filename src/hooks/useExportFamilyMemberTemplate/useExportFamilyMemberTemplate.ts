import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const exportFamilyMemberTemplate = () => {
  return client.get("/api/family-members/template/excel", {
    responseType: "blob",
  });
};

export const useExportFamilyMemberTemplate = () => {
  return useMutation({
    mutationKey: ["export-family-member-template"],
    mutationFn: exportFamilyMemberTemplate,
  });
};
