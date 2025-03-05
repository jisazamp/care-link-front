import { AgendaSettingsContract } from "./AgendaSettingContract/AgendaSettingContract";
import { BillingContract } from "./BillingContract/BillingContract";
import { CreateContract } from "./CreateContract/CreateContract";
import { ServicesContract } from "./ServicesContract/ServicesContract";
import { Steps, Button, Card, Typography, Breadcrumb } from "antd";
import { useState } from "react";
import {
  HomeOutlined,
  UserOutlined,
  FileDoneOutlined,
  SolutionOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

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
  const [services, setServices] = useState<Service[]>([]);

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
            setServices(selectedServices);
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
          services={services}
          onBack={() => setCurrentStep(2)}
        />
      ),
    },
  ];

  return (
    <>
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
    </>
  );
};
