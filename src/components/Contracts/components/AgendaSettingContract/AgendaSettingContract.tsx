import { Button, Calendar, Card, Typography, Alert } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { FormValues } from "../FormContracts";

// Extender dayjs con los plugins necesarios
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;

interface AgendaSettingsContractProps {
  onBack?: () => void;
}

export const AgendaSettingsContract = ({
  onBack,
}: AgendaSettingsContractProps) => {
  const { watch, setValue } = useFormContext<FormValues>();
  const services = watch("services");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const selectedDatesService = watch("selectedDatesService") || [];
  const selectedDatesTransport = watch("selectedDatesTransport") || [];
  const selectedDateDay = watch("selectedDateDay") ?? null;

  const { maxServiceDays, maxTransportDays, maxDayService } = useMemo(() => {
    const service = services.find((s) => s.serviceType.includes("Tiquetera"));
    const transport = services.find((s) =>
      s.serviceType.includes("Transporte"),
    );
    const day = services.find((s) => s.serviceType.includes("Servicio"));

    return {
      maxServiceDays: service?.quantity ?? 0,
      maxTransportDays: transport?.quantity ?? 0,
      maxDayService: day?.quantity ?? 0,
    };
  }, [services]);

  // Función para validar si una fecha está dentro del rango del contrato
  const isDateInContractRange = useCallback((date: Dayjs) => {
    if (!startDate || !endDate) return false;
    return date.isSameOrAfter(startDate, 'day') && date.isSameOrBefore(endDate, 'day');
  }, [startDate, endDate]);

  // Función para validar si una fecha está disponible para transporte
  const isDateAvailableForTransport = useCallback((date: Dayjs) => {
    const formattedDate = date.format("YYYY-MM-DD");
    // Solo se puede seleccionar transporte en días que ya están seleccionados para tiquetera
    return selectedDatesService.includes(formattedDate);
  }, [selectedDatesService]);

  // Función para deshabilitar fechas según el tipo de servicio
  const getDisabledDate = useCallback((type: "service" | "transport" | "day") => {
    return (current: Dayjs) => {
      // Deshabilitar fechas fuera del rango del contrato
      if (!isDateInContractRange(current)) {
        return true;
      }

      // Para transporte, solo permitir fechas que ya están seleccionadas en tiquetera
      if (type === "transport") {
        return !isDateAvailableForTransport(current);
      }

      // Deshabilitar sábados y domingos para todos los servicios
      const day = current.day();
      if (day === 0 || day === 6) {
        return true;
      }

      return false;
    };
  }, [isDateInContractRange, isDateAvailableForTransport]);

  const handleSelectDate = useCallback(
    (date: Dayjs, type: "service" | "transport" | "day") => {
      const formattedDate = date.format("YYYY-MM-DD");

      if (type === "service") {
        const current = selectedDatesService;
        const updated = current.includes(formattedDate)
          ? current.filter((d) => d !== formattedDate)
          : current.length < maxServiceDays
            ? [...current, formattedDate]
            : current;

        setValue("selectedDatesService", updated);
      } else if (type === "day") {
        setValue("selectedDateDay", formattedDate);
      } else {
        const current = selectedDatesTransport;
        const updated = current.includes(formattedDate)
          ? current.filter((d) => d !== formattedDate)
          : current.length < maxTransportDays
            ? [...current, formattedDate]
            : current;

        setValue("selectedDatesTransport", updated);
      }
    },
    [
      selectedDatesService,
      selectedDatesTransport,
      maxServiceDays,
      maxTransportDays,
      setValue,
    ],
  );

  const renderDateCell = (date: Dayjs, selectedDates: string[], type: "service" | "transport" | "day") => {
    const formattedDate = date.format("YYYY-MM-DD");
    const isSelected = selectedDates.includes(formattedDate);
    const isDisabled = getDisabledDate(type)(date);
    const isInRange = isDateInContractRange(date);
    
    // Para transporte, verificar si la fecha está disponible
    const isAvailableForTransport = type === "transport" ? isDateAvailableForTransport(date) : true;

    let backgroundColor = "transparent";
    let color = "#000";
    let cursor = "pointer";
    let border = "none";

    if (isSelected) {
      backgroundColor = "#722ED1";
      color = "#fff";
      border = "2px solid #5B21B6";
    } else if (isDisabled) {
      backgroundColor = "#f5f5f5";
      color = "#ccc";
      cursor = "not-allowed";
    } else if (!isInRange) {
      backgroundColor = "#f5f5f5";
      color = "#ccc";
      cursor = "not-allowed";
    } else if (type === "transport" && !isAvailableForTransport) {
      backgroundColor = "#fff2e8";
      color = "#d9d9d9";
      cursor = "not-allowed";
    } else {
      backgroundColor = "#f6ffed";
      color = "#52c41a";
      border = "1px solid #b7eb8f";
    }

    return (
      <div
        style={{
          backgroundColor,
          color,
          textAlign: "center",
          fontSize: "14px",
          width: "30px",
          height: "30px",
          lineHeight: "30px",
          borderRadius: "5px",
          border,
          cursor,
          margin: "auto",
        }}
        title={
          isDisabled 
            ? "Fecha no disponible" 
            : isSelected 
              ? "Fecha seleccionada" 
              : "Fecha disponible"
        }
      >
        {date.date()}
      </div>
    );
  };

  /* const disabledDate = (current: Dayjs) => {
    if (!startDate || !endDate) return true;

    const start = typeof startDate === "string" ? dayjs(startDate) : startDate;
    const end = typeof endDate === "string" ? dayjs(endDate) : endDate;

    return current.isBefore(start, "day") || current.isAfter(end, "day");
  }; */

  return (
    <Card variant="borderless">
      <Title level={4}>Configuración y Agenda</Title>
      
      {/* Mensaje informativo */}
      <Alert
        message="Instrucciones de selección de fechas"
        description={
          <div>
            <Text strong>Rango de fechas:</Text> Solo puede seleccionar fechas entre {startDate?.format('DD/MM/YYYY')} y {endDate?.format('DD/MM/YYYY')}.
            <br />
            <Text strong>Tiquetera:</Text> Seleccione los días de atención (máximo {maxServiceDays} días).
            <br />
            <Text strong>Transporte:</Text> Solo puede seleccionar transporte en días que ya están agendados para tiquetera.
            <br />
            <Text strong>Días no laborables:</Text> Los sábados y domingos están deshabilitados.
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {maxServiceDays > 0 && (
        <Card
          title={`Servicios de atención - (${selectedDatesService.length} de ${maxServiceDays} disponibles)`}
          variant="borderless"
          style={{ marginBottom: 16 }}
        >
          <Calendar
            fullscreen={false}
            onSelect={(date, info) => {
              if (info.source === "date") {
                handleSelectDate(date, "service");
              }
            }}
            fullCellRender={(date) =>
              renderDateCell(date, selectedDatesService, "service")
            }
            disabledDate={getDisabledDate("service")}
            style={{ width: "300px", margin: "auto" }}
          />
        </Card>
      )}

      {maxTransportDays > 0 && (
        <Card
          title={`Servicios de Transporte - (${selectedDatesTransport.length} de ${maxTransportDays} disponibles)`}
          variant="borderless"
          style={{ marginBottom: 16 }}
        >
          {selectedDatesService.length === 0 && (
            <Alert
              message="Seleccione primero los días de tiquetera"
              description="Debe seleccionar días de tiquetera antes de poder configurar el transporte."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Calendar
            fullscreen={false}
            onSelect={(date, info) => {
              if (info.source === "date") {
                handleSelectDate(date, "transport");
              }
            }}
            fullCellRender={(date) =>
              renderDateCell(date, selectedDatesTransport, "transport")
            }
            disabledDate={getDisabledDate("transport")}
            style={{ width: "300px", margin: "auto" }}
          />
        </Card>
      )}

      {maxDayService > 0 && (
        <Card title={"Servicios de día"} variant="borderless" style={{ marginBottom: 16 }}>
          <Calendar
            fullscreen={false}
            onSelect={(date, info) => {
              if (info.source === "date") {
                handleSelectDate(date, "day");
              }
            }}
            fullCellRender={(date) =>
              renderDateCell(date, selectedDateDay ? [selectedDateDay] : [], "day")
            }
            disabledDate={getDisabledDate("day")}
            style={{ width: "300px", margin: "auto" }}
          />
        </Card>
      )}

      <Card variant="borderless" style={{ marginTop: 24, textAlign: "right" }}>
        {onBack && (
          <Button onClick={onBack} style={{ marginRight: 8 }}>
            Atrás
          </Button>
        )}
        
        {/* Validación final */}
        <Button 
          type="primary" 
          onClick={() => {
            // Validar que se hayan seleccionado fechas de tiquetera
            if (maxServiceDays > 0 && selectedDatesService.length === 0) {
              alert("Debe seleccionar al menos un día de tiquetera.");
              return;
            }
            
            // Validar que no se haya excedido el límite de días
            if (selectedDatesService.length > maxServiceDays) {
              alert(`Ha seleccionado más días de tiquetera de los permitidos (${maxServiceDays}).`);
              return;
            }
            
            if (selectedDatesTransport.length > maxTransportDays) {
              alert(`Ha seleccionado más días de transporte de los permitidos (${maxTransportDays}).`);
              return;
            }
            
            // Validar que todas las fechas de transporte estén en las fechas de tiquetera
            const invalidTransportDates = selectedDatesTransport.filter(
              date => !selectedDatesService.includes(date)
            );
            
            if (invalidTransportDates.length > 0) {
              alert("Todas las fechas de transporte deben coincidir con fechas de tiquetera seleccionadas.");
              return;
            }
            
            alert("Configuración de agenda válida. Puede continuar.");
          }}
        >
          Validar Configuración
        </Button>
      </Card>
    </Card>
  );
};
