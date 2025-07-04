import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Layout,
  Row,
  Select,
  Table,
} from "antd";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import type { FormValues } from "../FormContracts";
import type { Service } from "../FormContracts";

const WEEKS_IN_MONTH = 4;

interface ServicesContractProps {
  onNext?: (selectedServices: Service[]) => void;
  onBack?: () => void;
}

const getSelectorOptions = (recordKey: string) => {
  switch (recordKey) {
    case "1":
      return Array.from({ length: 5 }, (_, i) => (
        <Select.Option key={`Tiquetera ${i + 1}`} value={`Tiquetera ${i + 1}`}>
          Tiquetera {i + 1}
        </Select.Option>
      ));
    case "2":
      return Array.from({ length: 5 }, (_, i) => (
        <Select.Option
          key={`Transporte ${i + 1}`}
          value={`Transporte ${i + 1}`}
        >
          Transporte {i + 1}
        </Select.Option>
      ));
    case "3":
      return (
        <Select.Option key="Servicio dia" value="Servicio dia">
          Servicio día
        </Select.Option>
      );
    default:
      return null;
  }
};

export const ServicesContract = ({ onNext, onBack }: ServicesContractProps) => {
  const methods = useFormContext<FormValues>();
  const services = methods.watch("services");

  const handleServiceChange = (key: string, value?: string) => {
    switch (key) {
      case "1":
        methods.setValue("selectedDatesService", []);
        break;
      case "2":
        methods.setValue("selectedDatesTransport", []);
        break;
      case "3":
        methods.setValue("selectedDateDay", null);
        break;
    }

    const quantity =
      value && (value.includes("Tiquetera") || value.includes("Transporte"))
        ? Number.parseInt(value.split(" ")[1]) * WEEKS_IN_MONTH
        : 1;

    const newServices = services.map((s) =>
      s.key === key ? { ...s, serviceType: value || "", quantity } : s,
    );
    methods.setValue("services", newServices);
  };

  const handleDescriptionChange = (key: string, value: string) => {
    const newServices = services.map((s) =>
      s.key === key ? { ...s, description: value } : s,
    );
    methods.setValue("services", newServices);
  };

  const handleNext = () => {
    if (onNext) {
      onNext(services);
    }
  };

  const columns = [
    {
      /*
      title: "Activar",
      dataIndex: "selected",
      render: (_: unknown, record: Service) => (
        <Checkbox
          checked={record.selected}
          onChange={(e) => {
            const checked = e.target.checked;
            const newServices = services.map((s) =>
              s.key === record.key ? { ...s, selected: checked } : s
            );
            methods.setValue("services", newServices);
          }}
        />
      ),
      width: 80,
    */
    },
    {
      title: "Inicia el",
      dataIndex: "startDate",
      render: (_: unknown, record: Service) => (
        <DatePicker
          style={{ width: "100%" }}
          value={dayjs(record.startDate)}
          disabled
        />
      ),
    },
    {
      title: "Finaliza el",
      dataIndex: "endDate",
      render: (_: unknown, record: Service) => (
        <DatePicker
          style={{ width: "100%" }}
          value={dayjs(record.endDate)}
          disabled
        />
      ),
    },
    {
      title: "Servicio",
      dataIndex: "serviceType",
      render: (_: unknown, record: Service) => (
        <Select
          style={{ width: "100%", minWidth: 200 }}
          value={record.serviceType || undefined}
          onChange={(value) => handleServiceChange(record.key, value)}
          allowClear
        >
          {getSelectorOptions(record.key)}
        </Select>
      ),
    },
    {
      title: "Cantidad Disponible",
      dataIndex: "quantity",
      render: (_: unknown, record: Service) => (
        <Input type="number" value={record.quantity} disabled />
      ),
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
      /*
      title: "Acciones",
      dataIndex: "actions",
      render: (_: unknown, record: Service) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            setServices((prev) =>
              prev.filter((service) => service.key !== record.key)
            );
          }}
        >
          Eliminar
        </Button>
      ),
    */
    },
  ];

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      <Card variant="borderless">
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

      <Card variant="borderless" style={{ marginTop: 24, textAlign: "right" }}>
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
