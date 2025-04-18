import { AgendaSettingsContract } from "./AgendaSettingContract/AgendaSettingContract";
import { BillingContract } from "./BillingContract/BillingContract";
import { CreateContract } from "./CreateContract/CreateContract";
import type { Dayjs } from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import { ServicesContract } from "./ServicesContract/ServicesContract";
import { Steps, Button, Card, Typography, Breadcrumb } from "antd";
import { useEffect, useState } from "react";
import {
  HomeOutlined,
  UserOutlined,
  FileDoneOutlined,
  SolutionOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { Contract, CreateContractRequest } from "../../../types";
import { useCreateContract } from "../../../hooks/useCreateContract/useCreateContract";
import { useGetContractById } from "../../../hooks/useGetContractById/useGetContractById";
import { useUpdateContract } from "../../../hooks/useUpdateContract/useUpdateContract";
import { useUpdateContractDates } from "../../../hooks/useUpdateContractDates/useUpdateContractDates";
import {
  convertContractData,
  buildContractFromForm,
  buildContractData,
} from "./utils/utils";

const { Title } = Typography;

const startingServices: Service[] = [
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
];

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
  const { mutate: updateContract } = useUpdateContract(contractId);
  const { mutate: updateContractDates } = useUpdateContractDates();

  const methods = useForm<FormValues>({
    defaultValues: {
      endDate: null,
      selectedDatesService: [],
      selectedDatesTransport: [],
      services: startingServices,
      startDate: null,
    },
  });
  const { reset, watch, handleSubmit, getValues, setValue } = methods;

  const startDate = watch("startDate");
  const [currentStep, setCurrentStep] = useState(0);
  const createContractMutation = useCreateContract(id);

  const onSubmit = (data: FormValues) => {
    if (contractId) {
      const newContract: Contract = buildContractFromForm(
        data,
        Number(id),
        Number(contractId)
      );

      const newServiceDates = data.selectedDatesService.map((s) => ({
        fecha: s,
      }));
      const newTransportDates = data.selectedDatesTransport.map((s) => ({
        fecha: s,
      }));

      updateContract(newContract);
      const serviceContractId =
        contract?.data.servicios[0].id_servicio_contratado;
      const serviceTransportId =
        contract?.data.servicios[1].id_servicio_contratado;

      serviceContractId &&
        updateContractDates({
          serviceId: serviceContractId,
          dates: newServiceDates,
        });

      serviceTransportId &&
        updateContractDates({
          serviceId: serviceTransportId,
          dates: newTransportDates,
        });
      return;
    }

    const contractData: CreateContractRequest = buildContractData(
      Number(id),
      data,
      getValues
    );

    createContractMutation.mutate(contractData);
  };

  useEffect(() => {
    if (startDate && !contractId) {
      const newServices: Service[] = startingServices.map((s) => ({
        ...s,
        startDate,
        endDate: startDate.add(1, "month"),
      }));
      setValue("services", newServices);
    }
  }, [startDate, setValue, contractId]);

  useEffect(() => {
    if (createContractMutation.isSuccess) {
      navigate(`/usuarios/${id}/detalles`);
    }
  }, [createContractMutation.isSuccess, navigate, id]);

  useEffect(() => {
    if (contract?.data) {
      const formValues = convertContractData(contract.data, startingServices);
      reset(formValues);
    }
  }, [contract?.data, reset]);

  const steps = [
    {
      title: !contractId ? "Crear contrato" : "Editar contrato",
      icon: <FileDoneOutlined />,
      content: (
        <CreateContract
          onNext={(data) => {
            setValue("startDate", data.startDate);
            setValue("endDate", data.endDate);
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
            setValue("services", services);
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
    reset();
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
          onClick={handleSubmit(onSubmit)}
        >
          Guardar y Continuar
        </Button>
      </Card>
    </FormProvider>
  );
};
