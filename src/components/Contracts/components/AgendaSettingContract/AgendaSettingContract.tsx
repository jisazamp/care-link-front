import dayjs, { Dayjs } from "dayjs";
import type { FormValues } from "../FormContracts";
import { Card, Typography, Button, Calendar } from "antd";
import { useFormContext } from "react-hook-form";
import { useMemo, useCallback } from "react";

const { Title } = Typography;

interface AgendaSettingsContractProps {
  onBack?: () => void;
}

export const AgendaSettingsContract = ({
  onBack,
}: AgendaSettingsContractProps) => {
  const { watch, setValue } = useFormContext<FormValues>();
  const services = watch("services");
  const selectedDatesService = watch("selectedDatesService") || [];
  const selectedDatesTransport = watch("selectedDatesTransport") || [];

  const startDate = watch("startDate"); // Expected to be a string or Dayjs
  const endDate = watch("endDate");

  const { maxServiceDays, maxTransportDays } = useMemo(() => {
    const service = services.find((s) => s.serviceType.includes("Tiquetera"));
    const transport = services.find((s) =>
      s.serviceType.includes("Transporte")
    );

    return {
      maxServiceDays: service?.quantity ?? 0,
      maxTransportDays: transport?.quantity ?? 0,
    };
  }, [services]);

  const handleSelectDate = useCallback(
    (date: Dayjs, type: "service" | "transport") => {
      const formattedDate = date.format("YYYY-MM-DD");

      if (type === "service") {
        const current = selectedDatesService;
        const updated = current.includes(formattedDate)
          ? current.filter((d) => d !== formattedDate)
          : current.length < maxServiceDays
            ? [...current, formattedDate]
            : current;

        setValue("selectedDatesService", updated);
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
    ]
  );

  const renderDateCell = (date: Dayjs, selectedDates: string[]) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const isSelected = selectedDates.includes(formattedDate);

    return (
      <div
        style={{
          backgroundColor: isSelected ? "#722ED1" : "transparent",
          color: isSelected ? "#fff" : "#000",
          textAlign: "center",
          fontSize: "14px",
          width: "30px",
          height: "30px",
          lineHeight: "30px",
          borderRadius: "5px",
          border: isSelected ? "2px solid #5B21B6" : "none",
          cursor: "pointer",
          margin: "auto",
        }}
      >
        {date.date()}
      </div>
    );
  };

  const disabledDate = (current: Dayjs) => {
    if (!startDate || !endDate) return true;

    const start = typeof startDate === "string" ? dayjs(startDate) : startDate;
    const end = typeof endDate === "string" ? dayjs(endDate) : endDate;

    return current.isBefore(start, "day") || current.isAfter(end, "day");
  };

  return (
    <Card bordered>
      <Title level={4}>Configuración y Agenda</Title>

      {maxServiceDays > 0 && (
        <Card
          title={`Servicios de atención - (${selectedDatesService.length} de ${maxServiceDays} disponibles)`}
          bordered
          style={{ marginBottom: 16 }}
        >
          <Calendar
            fullscreen={false}
            onSelect={(date) => handleSelectDate(date, "service")}
            fullCellRender={(date) =>
              renderDateCell(date, selectedDatesService)
            }
            disabledDate={disabledDate}
            style={{ width: "300px", margin: "auto" }}
          />
        </Card>
      )}

      {maxTransportDays > 0 && (
        <Card
          title={`Servicios de Transporte - (${selectedDatesTransport.length} de ${maxTransportDays} disponibles)`}
          bordered
        >
          <Calendar
            fullscreen={false}
            onSelect={(date) => handleSelectDate(date, "transport")}
            fullCellRender={(date) =>
              renderDateCell(date, selectedDatesTransport)
            }
            disabledDate={disabledDate}
            style={{ width: "300px", margin: "auto" }}
          />
        </Card>
      )}

      <Card bordered style={{ marginTop: 24, textAlign: "right" }}>
        {onBack && (
          <Button onClick={onBack} style={{ marginRight: 8 }}>
            Atrás
          </Button>
        )}
      </Card>
    </Card>
  );
};
