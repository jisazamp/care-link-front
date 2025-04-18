import { AgendaSettingsContract } from "./AgendaSettingContract/AgendaSettingContract";
import { BillingContract } from "./BillingContract/BillingContract";
import { CreateContract } from "./CreateContract/CreateContract";
import dayjs, { Dayjs } from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import { ServicesContract } from "./ServicesContract/ServicesContract";
import { Steps, Button, Card, Typography, Breadcrumb } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  HomeOutlined,
  UserOutlined,
  FileDoneOutlined,
  SolutionOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { CreateContractRequest } from "../../../types";
import { useCreateContract } from "../../../hooks/useCreateContract/useCreateContract";
import { useGetContractById } from "../../../hooks/useGetContractById/useGetContractById";

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
  const { id, contractId } = useParams();
  const navigate = useNavigate();

  const { data: contract } = useGetContractById(contractId);

  const startingServices: Service[] = useMemo(
    () => [
      {
        key: "1",
        startDate: null,
        endDate: null,
        serviceType: "",
        quantity: 0,
        description: "",
        selected: true,
        price: 0,
      },
      {
        key: "2",
        startDate: null,
        endDate: null,
        serviceType: "",
        quantity: 0,
        description: "",
        selected: true,
        price: 0,
      },
    ],
    []
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      endDate: null,
      selectedDatesService: [],
      selectedDatesTransport: [],
      services: startingServices,
      startDate: null,
    },
  });

  const startDate = methods.watch("startDate");
  const [currentStep, setCurrentStep] = useState(0);
  const createContractMutation = useCreateContract(id);

  const onSubmit = (data: FormValues) => {
    const contractData: CreateContractRequest = {
      id_usuario: Number(id),
      tipo_contrato: data.contractType,
      fecha_inicio:
        data.startDate?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
      fecha_fin:
        data.endDate?.format("YYYY-MM-DD") ??
        dayjs().add(1, "month").format("YYYY-MM-DD"),
      facturar_contrato: data.billed === "no" ? false : true,
      servicios: data.services
        .filter((s) => !!s.quantity)
        .map((s) => ({
          id_servicio: s.serviceType.includes("Transporte") ? 2 : 1,
          fecha:
            s.startDate?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
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
  };

  useEffect(() => {
    if (startDate && !contractId) {
      const newServices: Service[] = startingServices.map((s) => ({
        ...s,
        startDate,
        endDate: startDate.add(1, "month"),
      }));
      methods.setValue("services", newServices);
    }
  }, [startDate, methods.setValue, methods, startingServices, contractId]);

  useEffect(() => {
    if (createContractMutation.isSuccess) {
      navigate(`/usuarios/${id}/detalles`);
    }
  }, [createContractMutation.isSuccess, navigate, id]);

  useEffect(() => {
    if (contract?.data) {
      const {
        tipo_contrato,
        facturar_contrato,
        fecha_inicio,
        fecha_fin,
        servicios,
      } = contract.data;

      let services: Service[] = servicios.map((s) => ({
        description: s.descripcion,
        endDate: dayjs(s.fecha).add(1, "month"),
        key: s.id_servicio + "",
        price: s.precio_por_dia,
        quantity: s.fechas_servicio.length,
        selected: !!s.fechas_servicio.length,
        serviceType:
          s.id_servicio === 1
            ? `Tiquetera ${s.fechas_servicio.length / 4}`
            : `Transporte ${s.fechas_servicio.length / 4}`,
        startDate: dayjs(s.fecha),
      }));

      let selectedDatesService: string[] = [];
      let selectedDatesTransport: string[] = [];

      servicios.forEach((s) =>
        s.id_servicio === 1
          ? (selectedDatesService = s.fechas_servicio.map((f) => f.fecha))
          : (selectedDatesTransport = s.fechas_servicio.map((f) => f.fecha))
      );

      if (services.length === 1)
        services = [
          ...services,
          {
            ...startingServices[1],
            startDate: services[0].startDate,
            endDate: services[0].endDate,
          },
        ];

      methods.reset({
        contractType: tipo_contrato,
        billed: facturar_contrato ? "si" : "no",
        startDate: dayjs(fecha_inicio),
        endDate: dayjs(fecha_fin),
        services,
        selectedDatesService,
        selectedDatesTransport,
      });
    }
  }, [contract?.data, methods, startingServices]);

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
          onClick={methods.handleSubmit(onSubmit)}
        >
          Guardar y Continuar
        </Button>
      </Card>
    </FormProvider>
  );
};
