import { Layout, Card, Button, Table, Input, DatePicker, Select, Checkbox, Row, Col } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

// Definición de la interfaz para los servicios
interface Service {
  key: string;
  startDate: string;
  endDate: string;
  serviceType: string;
  quantity: number;
  description: string;
  selected: boolean;
}

interface ServicesContractProps {
  startDate: string; 
  endDate: string; 
  onNext?: (selectedServices: Service[]) => void; // ✅ Acepta un array de servicios seleccionados
  onBack?: () => void;
}

export const ServicesContract = ({ startDate, endDate, onNext, onBack }: ServicesContractProps) => {
  const [services, setServices] = useState<Service[]>([
    {
      key: "1",
      startDate,
      endDate,
      serviceType: "",
      quantity: 1,
      description: "",
      selected: true,
    },
    {
      key: "2",
      startDate,
      endDate,
      serviceType: "",
      quantity: 15,
      description: "",
      selected: true,
    },
  ]);

  // Actualizar fechas cuando se reciben desde CreateContract.tsx
  useEffect(() => {
    setServices((prev) =>
      prev.map((service) => ({
        ...service,
        startDate,
        endDate,
      }))
    );
  }, [startDate, endDate]);

  // Manejar cambios en el tipo de servicio y calcular la cantidad disponible automáticamente
  const handleServiceChange = (key: string, value: string) => {
    const quantity = value.includes("Tiquetera") || value.includes("Transporte") 
      ? parseInt(value.split(" ")[1]) 
      : 15;

    setServices((prev) =>
      prev.map((service) =>
        service.key === key ? { ...service, serviceType: value, quantity } : service
      )
    );
  };

  // Manejar cambios en la descripción del servicio
  const handleDescriptionChange = (key: string, value: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.key === key ? { ...service, description: value } : service
      )
    );
  };

  // Función para manejar el botón "Siguiente"
  const handleNext = () => {
    if (onNext) {
      onNext(services); // ✅ Enviar los servicios seleccionados correctamente
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: "Activar",
      dataIndex: "selected",
      render: (_: unknown, record: Service) => (
        <Checkbox
          checked={record.selected}
          onChange={(e) => {
            const checked = e.target.checked;
            setServices((prev) =>
              prev.map((service) =>
                service.key === record.key ? { ...service, selected: checked } : service
              )
            );
          }}
        />
      ),
      width: 80,
    },
    {
      title: "Inicia el",
      dataIndex: "startDate",
      render: (_: unknown, record: Service) => (
        <DatePicker style={{ width: "100%" }} value={dayjs(record.startDate)} disabled />
      ),
    },
    {
      title: "Finaliza el",
      dataIndex: "endDate",
      render: (_: unknown, record: Service) => (
        <DatePicker style={{ width: "100%" }} value={dayjs(record.endDate)} disabled />
      ),
    },
    {
      title: "Servicio",
      dataIndex: "serviceType",
      render: (_: unknown, record: Service) => (
        <Select
          style={{ width: "100%" }}
          value={record.serviceType || undefined}
          onChange={(value) => handleServiceChange(record.key, value)}
        >
          {record.key === "1"
            ? Array.from({ length: 15 }, (_, i) => (
                <Select.Option key={`Tiquetera ${i + 1}`} value={`Tiquetera ${i + 1}`}>
                  Tiquetera {i + 1}
                </Select.Option>
              ))
            : Array.from({ length: 15 }, (_, i) => (
                <Select.Option key={`Transporte ${i + 1}`} value={`Transporte ${i + 1}`}>
                  Transporte {i + 1}
                </Select.Option>
              ))}
        </Select>
      ),
    },
    {
      title: "Cantidad Disponible",
      dataIndex: "quantity",
      render: (_: unknown, record: Service) => <Input type="number" value={record.quantity} disabled />,
    },
    {
      title: "Descripción",
      dataIndex: "description",
      render: (_: unknown, record: Service) => (
        <Input
          maxLength={200}
          value={record.description}
          onChange={(e) => handleDescriptionChange(record.key, e.target.value)}
        />
      ),
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      render: (_: unknown, record: Service) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            setServices((prev) => prev.filter((service) => service.key !== record.key));
          }}
        >
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      <Card bordered>
        <Row justify="space-between" align="middle">
          <Col>
            <h3 style={{ margin: 0 }}>Servicios o productos incluidos</h3>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={services}
          pagination={false}
          style={{ marginTop: 16 }}
          rowKey="key"
        />
      </Card>

      <Card bordered style={{ marginTop: 24, textAlign: "right" }}>
        {onBack && (
          <Button onClick={onBack} style={{ marginRight: 8 }}>
            Atrás
          </Button>
        )}
        {onNext && (
          <Button type="primary" onClick={handleNext}>
            Siguiente
          </Button>
        )}
      </Card>
    </Layout>
  );
};
