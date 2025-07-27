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
  message,
} from "antd";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import { useGetServiceRates } from "../../../../hooks/useGetServiceRates/useGetServiceRates";
import type { FormValues } from "../FormContracts";
import type { Service } from "../FormContracts";

const WEEKS_IN_MONTH = 4;

interface ServicesContractProps {
  onNext?: (selectedServices: Service[]) => void;
  onBack?: () => void;
}

const getPlaceholder = (recordKey: string) => {
  switch (recordKey) {
    case "1":
      return "Elija un paquete de tiquetera";
    case "2":
      return "Elija un paquete de transporte";
    case "3":
      return "Servicio de día";
    default:
      return "Seleccione un servicio";
  }
};

const getServiceId = (serviceType: string) => {
  if (serviceType.includes("Transporte")) return 2;
  if (serviceType.includes("Tiquetera")) return 1;
  return 3;
};

const getSelectorOptions = (recordKey: string, services: Service[]) => {
  switch (recordKey) {
    case "1":
      // Verificar si hay servicio de día seleccionado para deshabilitar tiqueteras
      const diaService = services.find((s) => s.key === "3");
      const isDiaSelected = diaService?.serviceType === "Servicio dia";

      return Array.from({ length: 5 }, (_, i) => (
        <Select.Option
          key={`Tiquetera ${i + 1}`}
          value={`Tiquetera ${i + 1}`}
          disabled={isDiaSelected}
        >
          Tiquetera {i + 1}
        </Select.Option>
      ));
    case "2":
      // Obtener la tiquetera seleccionada para filtrar las opciones de transporte
      const tiqueteraService = services.find((s) => s.key === "1");
      const tiqueteraNumber = tiqueteraService?.serviceType
        ? parseInt(tiqueteraService.serviceType.split(" ")[1])
        : 0;

      // Si no hay tiquetera seleccionada, no mostrar opciones de transporte
      if (tiqueteraNumber === 0) {
        return [];
      }

      // Filtrar transportes para mostrar solo los que tienen número igual o menor a la tiquetera
      return Array.from({ length: tiqueteraNumber }, (_, i) => (
        <Select.Option
          key={`Transporte ${i + 1}`}
          value={`Transporte ${i + 1}`}
        >
          Transporte {i + 1}
        </Select.Option>
      ));
    case "3":
      // Verificar si hay tiquetera seleccionada para deshabilitar servicio de día
      const tiqueteraSelected = services.find((s) => s.key === "1");
      const isTiqueteraSelected =
        tiqueteraSelected?.serviceType &&
        tiqueteraSelected.serviceType.includes("Tiquetera");

      return (
        <Select.Option
          key="Servicio dia"
          value="Servicio dia"
          disabled={isTiqueteraSelected}
        >
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
  const startDate = methods.watch("startDate");

  // Obtener las tarifas de servicios
  const { data: serviceRatesData } = useGetServiceRates();

  // Función para obtener el precio de un servicio basándose en las tarifas
  const getServicePrice = (serviceId: number) => {
    if (!serviceRatesData?.data?.TarifasServicioPorAnio || !startDate) {
      return 0;
    }

    const year = startDate.year();
    const serviceRate = serviceRatesData.data.TarifasServicioPorAnio.find(
      (rate) => rate.id_servicio === serviceId && rate.anio === year,
    );

    return serviceRate?.precio_por_dia || 0;
  };

  const handleServiceChange = (key: string, value?: string) => {
    switch (key) {
      case "1":
        methods.setValue("selectedDatesService", []);
        // Limpiar transporte si la nueva tiquetera es menor que el transporte seleccionado
        const transporteService = services.find((s) => s.key === "2");
        if (transporteService?.serviceType && value) {
          const tiqueteraNumber = parseInt(value.split(" ")[1]);
          const transporteNumber = parseInt(
            transporteService.serviceType.split(" ")[1],
          );
          if (transporteNumber > tiqueteraNumber) {
            // Limpiar la selección de transporte
            const newServices = services.map((s) =>
              s.key === "2"
                ? { ...s, serviceType: "", quantity: 0, price: 0 }
                : s,
            );
            methods.setValue("services", newServices);
          }
        }

        // Si se selecciona una tiquetera, limpiar el servicio de día
        if (value) {
          const newServices = services.map((s) =>
            s.key === "3"
              ? { ...s, serviceType: "", quantity: 0, price: 0 }
              : s,
          );
          methods.setValue("services", newServices);
        }
        break;
      case "2":
        methods.setValue("selectedDatesTransport", []);
        break;
      case "3":
        methods.setValue("selectedDateDay", null);
        // Si se selecciona el servicio de día, limpiar la tiquetera
        if (value) {
          const newServices = services.map((s) =>
            s.key === "1"
              ? { ...s, serviceType: "", quantity: 0, price: 0 }
              : s,
          );
          methods.setValue("services", newServices);
        }
        break;
    }

    const quantity =
      value && (value.includes("Tiquetera") || value.includes("Transporte"))
        ? Number.parseInt(value.split(" ")[1]) * WEEKS_IN_MONTH
        : 1;

    // Calcular el precio basándose en las tarifas de servicios
    const serviceId = getServiceId(value || "");
    const price = getServicePrice(serviceId);

    const newServices = services.map((s) =>
      s.key === key ? { ...s, serviceType: value || "", quantity, price } : s,
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
    // Validar que se haya seleccionado al menos una tiquetera
    const tiqueteraService = services.find((s) => s.key === "1");
    if (!tiqueteraService?.serviceType) {
      message.error("Debe seleccionar una tiquetera antes de continuar");
      return;
    }

    // Validar que si hay transporte seleccionado, sea válido según la tiquetera
    const transporteService = services.find((s) => s.key === "2");
    if (transporteService?.serviceType) {
      const tiqueteraNumber = parseInt(
        tiqueteraService.serviceType.split(" ")[1],
      );
      const transporteNumber = parseInt(
        transporteService.serviceType.split(" ")[1],
      );

      if (transporteNumber > tiqueteraNumber) {
        message.error(
          `El transporte seleccionado (${transporteService.serviceType}) no es válido para la tiquetera seleccionada (${tiqueteraService.serviceType}). El transporte debe tener un número igual o menor.`,
        );
        return;
      }
    }

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
      render: (_: unknown, record: Service) => {
        // Verificar si el campo debe estar deshabilitado
        let isDisabled = false;

        if (record.key === "1") {
          // Deshabilitar tiquetera si hay servicio de día seleccionado
          const diaService = services.find((s) => s.key === "3");
          isDisabled = diaService?.serviceType === "Servicio dia";
        } else if (record.key === "3") {
          // Deshabilitar servicio de día si hay tiquetera seleccionada
          const tiqueteraService = services.find((s) => s.key === "1");
          isDisabled = !!(
            tiqueteraService?.serviceType &&
            tiqueteraService.serviceType.includes("Tiquetera")
          );
        }

        return (
          <Select
            style={{ width: "100%", minWidth: 200 }}
            value={record.serviceType || undefined}
            onChange={(value) => handleServiceChange(record.key, value)}
            allowClear
            placeholder={getPlaceholder(record.key)}
            disabled={isDisabled}
          >
            {getSelectorOptions(record.key, services)}
          </Select>
        );
      },
    },
    {
      title: "Cantidad Disponible",
      dataIndex: "quantity",
      render: (_: unknown, record: Service) => (
        <Input type="number" value={record.quantity} disabled />
      ),
    },
    {
      title: "Precio",
      dataIndex: "price",
      render: (_: unknown, record: Service) => (
        <Input
          value={record.price ? `$${record.price.toLocaleString()}` : "$0"}
          disabled
          style={{ textAlign: "right" }}
        />
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
            <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
              <strong>Nota:</strong> El transporte seleccionado debe tener un
              número igual o menor al de la tiquetera. Por ejemplo, si
              selecciona Tiquetera 3, solo podrá elegir Transporte 1, 2 o 3.
              <br />
              <strong>Importante:</strong> La tiquetera y el servicio de día son
              mutuamente excluyentes. Si selecciona una tiquetera, el servicio
              de día se deshabilitará y viceversa.
            </p>
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
