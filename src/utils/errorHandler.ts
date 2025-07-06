/**
 * Función utilitaria para manejar errores de API y mostrar mensajes claros al usuario
 * Basado en las mejores prácticas de manejo de errores en React
 */

export interface ApiError {
  response?: {
    data?: {
      detail?: string;
      message?: string;
      error?: string | string[];
    };
    status?: number;
  };
  message?: string;
}

/**
 * Extrae el mensaje de error más relevante de una respuesta de API
 */
export const extractErrorMessage = (
  error: ApiError,
  defaultMessage: string = "Ha ocurrido un error",
): string => {
  // Prioridad 1: Mensaje específico del backend en 'detail'
  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }

  // Prioridad 2: Mensaje en 'message'
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Prioridad 3: Array de errores
  if (error?.response?.data?.error) {
    const errorData = error.response.data.error;
    if (Array.isArray(errorData)) {
      return errorData.join(", ");
    }
    return String(errorData);
  }

  // Prioridad 4: Mensaje general del error
  if (error?.message) {
    return error.message;
  }

  // Prioridad 5: Mensajes basados en códigos de estado HTTP
  const status = error?.response?.status;
  if (status) {
    switch (status) {
      case 400:
        return "Datos inválidos. Verifique la información ingresada.";
      case 401:
        return "No autorizado. Inicie sesión nuevamente.";
      case 403:
        return "Acceso denegado. No tiene permisos para realizar esta acción.";
      case 404:
        return "Recurso no encontrado.";
      case 409:
        return "Conflicto: Los datos ingresados generan un conflicto con información existente.";
      case 422:
        return "Datos de entrada inválidos. Verifique el formato de la información.";
      case 500:
        return "Error interno del servidor. Intente nuevamente más tarde.";
      case 502:
        return "Error de comunicación con el servidor.";
      case 503:
        return "Servicio temporalmente no disponible.";
      default:
        return `Error del servidor (${status}). Intente nuevamente.`;
    }
  }

  // Mensaje por defecto
  return defaultMessage;
};

/**
 * Maneja errores específicos de contratos
 */
export const handleContractError = (error: ApiError): string => {
  const status = error?.response?.status;

  // Errores específicos de contratos
  if (status === 409) {
    return "El paciente ya está agendado para alguna de las fechas seleccionadas. No se puede crear un doble agendamiento.";
  }

  if (status === 400) {
    const detail = error?.response?.data?.detail;
    if (detail && detail.includes("agendado")) {
      // Extraer la fecha del mensaje (formato DD/MM/YYYY)
      const fechaMatch = detail.match(/fecha (\d{2}\/\d{2}\/\d{4})/);
      if (fechaMatch) {
        return `El paciente ya está agendado para el día ${fechaMatch[1]}. Por favor verifique las fechas agendadas y corrija el error.`;
      }
      return detail;
    }
    return "Datos del contrato inválidos. Verifique la información ingresada.";
  }

  // Para errores 500, intentar extraer el mensaje específico
  if (status === 500) {
    const detail = error?.response?.data?.detail;
    if (detail && detail.includes("agendado")) {
      // Extraer la fecha del mensaje (formato DD/MM/YYYY)
      const fechaMatch = detail.match(/fecha (\d{2}\/\d{2}\/\d{4})/);
      if (fechaMatch) {
        return `El paciente ya está agendado para el día ${fechaMatch[1]}. Por favor verifique las fechas agendadas y corrija el error.`;
      }
      return detail;
    }
    // Si el error 500 contiene información sobre doble agendamiento
    const errorMessage = error?.response?.data?.message || error?.message || "";
    if (errorMessage.includes("agendado") || errorMessage.includes("doble")) {
      return errorMessage;
    }
  }

  // Usar la función general para otros casos
  return extractErrorMessage(error, "Error al procesar el contrato");
};

/**
 * Maneja errores específicos de cronogramas
 */
export const handleScheduleError = (error: ApiError): string => {
  const status = error?.response?.status;

  if (status === 409) {
    return "El paciente ya está agendado para esta fecha. No se puede crear un doble agendamiento.";
  }

  return extractErrorMessage(error, "Error al procesar el cronograma");
};

/**
 * Maneja errores específicos de transporte
 */
export const handleTransportError = (error: ApiError): string => {
  const status = error?.response?.status;

  if (status === 409) {
    return "Ya existe un transporte programado para este paciente en esta fecha.";
  }

  return extractErrorMessage(error, "Error al procesar el transporte");
};
