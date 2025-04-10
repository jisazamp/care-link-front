import { AgendaSettingsContract } from "./AgendaSettingContract/AgendaSettingContract";
import { BillingContract } from "./BillingContract/BillingContract";
import { CreateContract } from "./CreateContract/CreateContract";
import dayjs, { Dayjs } from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
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
import { useParams } from "react-router-dom";
import { CreateContractRequest } from "../../../types";
import { useCreateContract } from "../../../hooks/useCreateContract/useCreateContract";

const { Title } = Typography;

export interface Service {
  description: string;
  endDate: Dayjs | null;
  key: string;
  price: number;
  quantity: number;
  selected: boolean;
  serviceType: string;
  startDate: Dayjs | null;
}

export interface FormValues {
  billed: string;
  contractType: string;
  endDate: Dayjs | null;
  selectedDatesService: string[];
  selectedDatesTransport: string[];
  services: Service[];
  startDate: Dayjs | null;
}

export const FormContracts = () => {
  const { id } = useParams();

  const methods = useForm<FormValues>({
    defaultValues: {
      endDate: null,
      selectedDatesService: [],
      selectedDatesTransport: [],
      services: [],
      startDate: null,
    },
  });

  const [currentStep, setCurrentStep] = useState(0);
  const createContractMutation = useCreateContract();

  const steps = [
    {
      title: "Crear contrato",
      icon: <FileDoneOutlined />,
      content: (
        <CreateContract
          onNext={(data) => {
            methods.setValue("startDate", data.startDate);
            methods.setValue("endDate", data.endDate);
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
          onNext={(services: Service[]) => {
            methods.setValue("services", services);
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
      content: <AgendaSettingsContract onBack={() => setCurrentStep(2)} />,
    },
  ];

  const resetAll = () => {
    methods.reset();
    setCurrentStep(0);
  };

  return (
    <FormProvider {...methods}>
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
          style={{ marginRight: 8 }}
          onClick={resetAll}
        >
          Restablecer
        </Button>

        <Button
          type="primary"
          className="main-button"
          disabled={currentStep !== steps.length - 1}
          loading={createContractMutation.isPending}
          onClick={methods.handleSubmit((data) => {
            const contractData: CreateContractRequest = {
              id_usuario: Number(id),
              tipo_contrato: data.contractType,
              fecha_inicio:
                data.startDate?.format("YYYY-MM-DD") ??
                dayjs().format("YYYY-MM-DD"),
              fecha_fin:
                data.endDate?.format("YYYY-MM-DD") ??
                dayjs().add(1, "month").format("YYYY-MM-DD"),
              facturar_contrato: data.billed === "no" ? false : true,
              servicios: data.services.map((s) => ({
                id_servicio: s.serviceType.includes("Transporte") ? 2 : 1,
                fecha:
                  s.startDate?.format("YYYY-MM-DD") ??
                  dayjs().format("YYYY-MM-DD"),
                descripcion: s.description,
                precio_por_dia: s.price,
                fechas_servicio: s.serviceType.includes("Transporte")
                  ? methods
                    .getValues("selectedDatesTransport")
                    .map((f) => ({ fecha: f }))
                  : methods
                    .getValues("selectedDatesService")
                    .map((f) => ({ fecha: f })),
              })),
            };
            createContractMutation.mutate(contractData);
          })}
        >
          Guardar y Continuar
        </Button>
      </Card>
    </FormProvider>
  );
};
