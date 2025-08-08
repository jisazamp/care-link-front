import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import dayjs from "dayjs";

// Hooks
import { useGetUserById } from "../useGetUserById/useGetUserById";
import {
  useCreateHomeVisit,
  CreateHomeVisitData,
} from "../useCreateHomeVisit/useCreateHomeVisit";
import {
  useUpdateHomeVisit,
  UpdateHomeVisitData,
} from "../useUpdateHomeVisit/useUpdateHomeVisit";
import { useGetHomeVisitById } from "../useGetHomeVisitById/useGetHomeVisitById";
import { useCreateHomeVisitBill } from "../useCreateHomeVisitBill/useCreateHomeVisitBill";
import { useCreatePayment } from "../useCreatePayment/useCreatePayment";
import { useAuthStore } from "../../store/auth";

export interface UseHomeVisitWizardReturn {
  // Estado
  isEditing: boolean;
  isLoading: boolean;
  isSubmitting: boolean;

  // Datos
  user: any;
  existingVisit: any;

  // Funciones
  handleSubmit: (formData: any) => Promise<void>;
  handleCancel: () => void;
}

export const useHomeVisitWizard = (): UseHomeVisitWizardReturn => {
  const { id: userId, visitaId } = useParams();
  const navigate = useNavigate();

  // Estado
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determinar si estamos editando
  const isEditing = !!visitaId;

  // Hooks de datos
  const { data: user, isLoading: loadingUser } = useGetUserById(userId);
  const { data: existingVisit, isLoading: loadingVisit } =
    useGetHomeVisitById(visitaId);

  // Debug logs
  console.log("=== DEBUG useHomeVisitWizard ===");
  console.log("userId:", userId);
  console.log("visitaId:", visitaId);
  console.log("isEditing:", isEditing);
  console.log("loadingUser:", loadingUser);
  console.log("loadingVisit:", loadingVisit);
  console.log("user data:", user);
  console.log("existingVisit data:", existingVisit);
  console.log("existingVisit?.data:", existingVisit?.data);

  // Hooks de mutaciones
  const { mutate: createHomeVisit, isPending: creatingVisit } =
    useCreateHomeVisit();
  const { mutate: updateHomeVisit, isPending: updatingVisit } =
    useUpdateHomeVisit();
  const { mutate: createBill, isPending: creatingBill } =
    useCreateHomeVisitBill();
  const { addPaymentsToFacturaFnAsync } = useCreatePayment();

  // Estado de carga combinado
  const isLoading = loadingUser || (isEditing && loadingVisit);

  // Estado de envío combinado
  const isSubmittingState =
    isSubmitting || creatingVisit || updatingVisit || creatingBill;

  // Función para manejar la cancelación
  const handleCancel = () => {
    navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (formData: any) => {
    if (!userId) {
      message.error("ID de usuario no válido");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && existingVisit?.data) {
        // Actualizar visita existente
        await handleUpdateVisit(formData);
      } else {
        // Crear nueva visita
        await handleCreateVisit(formData);
      }
    } catch (error) {
      console.error("Error en el proceso:", error);
      message.error("Error al procesar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para actualizar visita existente
  const handleUpdateVisit = async (formData: any) => {
    if (!visitaId) {
      message.error("ID de visita no válido");
      return;
    }

    const updateData: UpdateHomeVisitData = {
      fecha_visita: formData.fecha_visita
        ? formData.fecha_visita.format("YYYY-MM-DD")
        : undefined,
      hora_visita: formData.hora_visita
        ? formData.hora_visita.format("HH:mm:ss")
        : undefined,
      direccion_visita: user?.direccion || "",
      telefono_visita: user?.telefono || "",
      valor_dia: 25000,
      observaciones: formData.observaciones || "",
      id_profesional_asignado: formData.profesional_asignado || undefined,
    };

    return new Promise<void>((_, reject) => {
      updateHomeVisit(
        {
          userId: parseInt(userId!),
          visitaId: parseInt(visitaId!),
          data: updateData,
        },
        {
          onSuccess: () => {
            message.success("Visita domiciliaria actualizada exitosamente");
            navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`);
          },
          onError: (error: any) => {
            message.error("Error al actualizar la visita: " + error.message);
            reject(error);
          },
        },
      );
    });
  };

  // Función para crear nueva visita
  const handleCreateVisit = async (formData: any) => {
    const visitaData: CreateHomeVisitData = {
      id_usuario: parseInt(userId!),
      fecha_visita: formData.fecha_visita
        ? formData.fecha_visita.format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      hora_visita: formData.hora_visita
        ? formData.hora_visita.format("HH:mm:ss")
        : "08:00:00",
      direccion_visita: user?.direccion || "",
      telefono_visita: user?.telefono || "",
      valor_dia: 25000, // Valor por defecto
      observaciones: formData.observaciones || "",
      id_profesional_asignado: formData.profesional_asignado || undefined,
    };

    return new Promise<void>((_, reject) => {
      createHomeVisit(visitaData, {
        onSuccess: async (response) => {
          const newHomeVisitId = response.data.data.id_visitadomiciliaria;

          // Crear la factura con los datos del wizard
          const billData = {
            user_id: parseInt(userId!),
            bill_data: {
              id_visita_domiciliaria: newHomeVisitId,
              fecha_emision: dayjs().format("YYYY-MM-DD"),
              fecha_vencimiento: formData.fecha_vencimiento
                ? formData.fecha_vencimiento.format("YYYY-MM-DD")
                : "",
              subtotal: 25000, // Valor por día
              impuestos: formData.impuestos || 0,
              descuentos: formData.descuentos || 0,
              total_factura:
                25000 + (formData.impuestos || 0) - (formData.descuentos || 0),
              observaciones: formData.observaciones_factura || "",
            },
          };

          // Crear la factura
          createBill(billData, {
            onSuccess: async (billResponse) => {
              const facturaId = billResponse.data.data.id_factura;

              // Si hay pagos configurados, enviarlos
              if (formData.payments && formData.payments.length > 0) {
                try {
                  // Verificar que el usuario esté autenticado
                  const token = useAuthStore.getState().jwtToken;
                  if (!token) {
                    message.warning(
                      "Visita domiciliaria y factura creadas, pero no se pudieron enviar los pagos (no hay sesión activa)",
                    );
                    navigate(
                      `/visitas-domiciliarias/usuarios/${userId}/detalles`,
                    );
                    return;
                  }

                  // Enviar pagos a la factura
                  const paymentsData = formData.payments.map(
                    (payment: any) => ({
                      id_metodo_pago: payment.paymentMethod,
                      id_tipo_pago: payment.id_tipo_pago,
                      fecha_pago: payment.paymentDate,
                      valor: payment.amount,
                    }),
                  );

                  await addPaymentsToFacturaFnAsync({
                    facturaId: facturaId,
                    payments: paymentsData,
                  });

                  message.success(
                    "Visita domiciliaria, factura y pagos creados exitosamente",
                  );
                } catch (error: any) {
                  console.error("Error al enviar pagos:", error);
                  if (error.response?.status === 401) {
                    message.warning(
                      "Visita domiciliaria y factura creadas, pero la sesión expiró. Los pagos se pueden agregar manualmente más tarde.",
                    );
                  } else {
                    message.warning(
                      "Visita domiciliaria y factura creadas, pero hubo un problema con los pagos",
                    );
                  }
                }
              } else {
                message.success(
                  "Visita domiciliaria y factura creadas exitosamente",
                );
              }

              navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`);
            },
            onError: (error: any) => {
              message.error("Error al crear la factura: " + error.message);
              reject(error);
            },
          });
        },
        onError: (error: any) => {
          message.error("Error al crear la visita: " + error.message);
          reject(error);
        },
      });
    });
  };

  return {
    // Estado
    isEditing,
    isLoading,
    isSubmitting: isSubmittingState,

    // Datos
    user: user?.data?.data,
    existingVisit: existingVisit?.data,

    // Funciones
    handleSubmit,
    handleCancel,
  };
};
