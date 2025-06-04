import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const deletePayment = (id: number) => client.delete(`/api/pagos/${id}`);

const useDeletePayment = () => {
  const { mutate: deletePaymentFn, isPending: deletePaymentPending } =
    useMutation({
      mutationKey: ["delete-payment"],
      mutationFn: deletePayment,
    });

  return { deletePaymentFn, deletePaymentPending };
};

export { useDeletePayment };
