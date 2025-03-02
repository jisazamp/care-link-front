import { useState } from "react";
import { Steps, Layout, Button, Card, Typography, Breadcrumb } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  FileDoneOutlined,
  SolutionOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { CreateContract } from "./CreateContract/CreateContract";
import { ServicesContract } from "./ServicesContract/ServicesContract";
import { BillingContract } from "./BillingContract/BillingContract";
import { AgendaSettingsContract } from "./AgendaSettingContract/AgendaSettingContract";

const { Title } = Typography;

// Definir la estructura de los servicios
interface Service {
  key: string;
  startDate: string;
  endDate: string;
  serviceType: string;
  quantity: number;
  description: string;
  selected: boolean;
}

export const FormContracts = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]); // ✅ Se especifica correctamente el tipo

  const steps = [
    {
      title: "Crear contrato",
      icon: <FileDoneOutlined />,
      content: (
        <CreateContract
          onNext={(data) => {
            setStartDate(data.startDate);
            setEndDate(data.endDate);
            setCurrentStep(1);
          }}
        />
      ),
    },
    {
      title: "Detalle de servicios",
      icon: <SolutionOutlined />,
      content: (
        <ServicesContract
          startDate={startDate}
          endDate={endDate}
          onNext={(selectedServices: Service[]) => {
            // ✅ Se define correctamente el tipo de datos esperado
            setServices(selectedServices); // ✅ Se guarda el array de servicios correctamente
            setCurrentStep(2);
          }}
          onBack={() => setCurrentStep(0)}
        />
      ),
    },
    {
      title: "Facturación",
      icon: <DollarOutlined />,
      content: (
        <BillingContract
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      ),
    },
    {
      title: "Configuración y Agenda",
      icon: <CalendarOutlined />,
      content: (
        <AgendaSettingsContract
          services={services} // ✅ Se pasa correctamente la lista de servicios
          onBack={() => setCurrentStep(2)}
        />
      ),
    },
  ];

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      {/* ✅ Breadcrumb agregado globalmente */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <HomeOutlined />, href: "/inicio" },
          { title: <UserOutlined />, href: "/usuarios" },
          { title: "Nombre_Usuario", href: "#" },
          { title: "Contrato" },
        ]}
      />

      <Card bordered>
        <Title level={4}>Gestión de Contratos</Title>
        <Steps
          current={currentStep}
          items={steps.map((step, index) => ({
            title: step.title,
            icon: step.icon,
            className:
              index === currentStep
                ? "ant-steps-item-process"
                : index < currentStep
                  ? "ant-steps-item-finish"
                  : "ant-steps-item-wait",
          }))}
        />
      </Card>

      <div style={{ marginTop: "24px" }}>{steps[currentStep].content}</div>

      {/* ✅ Tarjeta con botones de Restablecer y Guardar y Continuar */}
      <Card bordered style={{ marginTop: 24, textAlign: "right" }}>
        <Button
          className="main-button"
          onClick={() => setCurrentStep(0)}
          style={{ marginRight: 8 }}
        >
          Restablecer
        </Button>

        <Button
          type="primary"
          className="main-button"
          disabled={currentStep !== steps.length - 1}
        >
          Guardar y Continuar
        </Button>
      </Card>
    </Layout>
  );
};
