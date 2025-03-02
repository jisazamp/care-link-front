import type { Dayjs } from "dayjs";
import { Layout, Card, Typography, Button, Calendar } from "antd";
import { ScheduleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Title } = Typography;

interface Service {
  serviceType: string;
  quantity: number;
}

interface AgendaSettingsContractProps {
  services: Service[];
  onBack?: () => void;
}

export const AgendaSettingsContract = ({
  services,
  onBack,
}: AgendaSettingsContractProps) => {
  const [selectedDatesService, setSelectedDatesService] = useState<string[]>(
    []
  );
  const [selectedDatesTransport, setSelectedDatesTransport] = useState<
    string[]
  >([]);
  const [maxServiceDays, setMaxServiceDays] = useState(0);
  const [maxTransportDays, setMaxTransportDays] = useState(0);

  // Actualizar la cantidad máxima de días basada en la selección del usuario
  useEffect(() => {
    const selectedService = services.find((s) =>
      s.serviceType.includes("Tiquetera")
    );
    const selectedTransport = services.find((s) =>
      s.serviceType.includes("Transporte")
    );

    setMaxServiceDays(selectedService ? selectedService.quantity : 0);
    setMaxTransportDays(selectedTransport ? selectedTransport.quantity : 0);
  }, [services]);

  // Manejar la selección de fechas en el calendario
  const handleSelectDate = (date: Dayjs, type: "service" | "transport") => {
    const formattedDate = date.format("YYYY-MM-DD");

    if (type === "service") {
      if (selectedDatesService.includes(formattedDate)) {
        setSelectedDatesService(
          selectedDatesService.filter((d) => d !== formattedDate)
        );
      } else if (selectedDatesService.length < maxServiceDays) {
        setSelectedDatesService([...selectedDatesService, formattedDate]);
      }
    } else {
      if (selectedDatesTransport.includes(formattedDate)) {
        setSelectedDatesTransport(
          selectedDatesTransport.filter((d) => d !== formattedDate)
        );
      } else if (selectedDatesTransport.length < maxTransportDays) {
        setSelectedDatesTransport([...selectedDatesTransport, formattedDate]);
      }
    }
  };

  // Personalizar la celda del calendario
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

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      <Card bordered>
        <Title level={4}>Configuración y Agenda</Title>

        {/* Calendario de Servicios */}
        {maxServiceDays > 0 && (
          <Card
            title={`Servicios de atención - Tiquetera ${maxServiceDays} (${selectedDatesService.length} de ${maxServiceDays} disponibles)`}
            bordered
            extra={
              <Button type="primary" icon={<ScheduleOutlined />}>
                Programar
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            <Calendar
              fullscreen={false}
              onSelect={(date) => handleSelectDate(date, "service")}
              dateFullCellRender={(date) =>
                renderDateCell(date, selectedDatesService)
              }
              style={{ width: "300px", margin: "auto" }}
            />
          </Card>
        )}

        {/* Calendario de Transporte */}
        {maxTransportDays > 0 && (
          <Card
            title={`Servicios de Transporte - Transporte ${maxTransportDays} (${selectedDatesTransport.length} de ${maxTransportDays} disponibles)`}
            bordered
            extra={
              <Button type="primary" icon={<ScheduleOutlined />}>
                Programar
              </Button>
            }
          >
            <Calendar
              fullscreen={false}
              onSelect={(date) => handleSelectDate(date, "transport")}
              dateFullCellRender={(date) =>
                renderDateCell(date, selectedDatesTransport)
              }
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
          <Button type="primary" icon={<ScheduleOutlined />}>
            Guardar Agenda
          </Button>
        </Card>
      </Card>
    </Layout>
  );
};
