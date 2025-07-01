import {
  CalendarOutlined,
  DollarOutlined,
  FileDoneOutlined,
  HomeOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Card, Steps, Typography } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateBill } from "../../../hooks/useCreateBill";
import { useCreateContract } from "../../../hooks/useCreateContract/useCreateContract";
import { useCreatePayment } from "../../../hooks/useCreatePayment/useCreatePayment";
import { useGetBillPayments } from "../../../hooks/useGetBillPayments/useGetBillPayments";
import { useGetContractBill } from "../../../hooks/useGetContractBill";
import { useGetContractById } from "../../../hooks/useGetContractById/useGetContractById";
import { useGetPaymentMethods } from "../../../hooks/useGetPaymentMethods";
import { useUpdateContract } from "../../../hooks/useUpdateContract/useUpdateContract";
import type {
  CreateContractRequest,
  Payment,
  UpdateContractRequest,
} from "../../../types";
import { AgendaSettingsContract } from "./AgendaSettingContract/AgendaSettingContract";
import { BillingContract } from "./BillingContract/BillingContract";
import { CreateContract } from "./CreateContract/CreateContract";
import { ServicesContract } from "./ServicesContract/ServicesContract";
import { buildContractData, convertContractData } from "./utils/utils";

const { Title } = Typography;

const startingServices: Service[] = [
  {
    description: "",
    endDate: null,
    key: "1",
    price: 0,
    quantity: 0,
    selected: true,
    serviceType: "",
    startDate: null,
  },
  {
    description: "",
    endDate: null,
    key: "2",
    price: 0,
    quantity: 0,
    selected: true,
    serviceType: "",
    startDate: null,
  },
  {
    description: "",
    endDate: null,
    key: "3",
    price: 0,
    quantity: 0,
    selected: true,
    serviceType: "",
    startDate: null,
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
  selectedDateDay: string | null;
  services: Service[];
  startDate: Dayjs | null;
  payments: { paymentMethod: number; paymentDate: string; amount: number }[];
}

export const FormContracts = () => {
  const { id, contractId } = useParams();
  const navigate = useNavigate();

  const { data: contract } = useGetContractById(contractId);
  const { mutate: updateContract } = useUpdateContract(contractId);

  const methods = useForm<FormValues>({
    defaultValues: {
      endDate: null,
      selectedDatesService: [],
      selectedDatesTransport: [],
      selectedDateDay: null,
      services: startingServices,
      startDate: null,
    },
  });
  const { reset, watch, handleSubmit, getValues, setValue } = methods;

  const startDate = watch("startDate");
  const [currentStep, setCurrentStep] = useState(0);
  const createContractMutation = useCreateContract(id);
  const { createContractBillFn, createContractPending } = useCreateBill();
  const { createPaymentFnAsync, createPaymentPending } = useCreatePayment();
  const { contractBillData } = useGetContractBill(Number(contractId));
  const { paymentMethodsData } = useGetPaymentMethods();
  const { data: billPayments } = useGetBillPayments(
    Number(contractBillData?.data.data.id_factura),
  );

  const onSubmit = (data: FormValues) => {
    if (contractId) {
      const newContract: UpdateContractRequest = buildContractData(
        Number(id),
        data,
        getValues,
      ) as UpdateContractRequest;
      newContract.id_contrato = Number(contractId);

      const newPayments = data.payments?.slice(billPayments?.data.length) ?? [];
      const billId = contractBillData?.data.data.id_factura;

      updateContract(newContract, {
        onSuccess: async () => {
          if (billId) {
            const paymentData: Omit<Payment, "id_pago">[] = newPayments.map(
              (p) => ({
                id_factura: billId,
                id_metodo_pago:
                  paymentMethodsData?.data.data.find(
                    (m) => m.nombre === `${p.paymentMethod}`,
                  )?.id_metodo_pago ?? 1,
                valor: p.amount,
                fecha_pago: dayjs(p.paymentDate).format("YYYY-MM-DD"),
                id_tipo_pago: 1,
              }),
            );
            for (let i = 0; i < paymentData.length; i++) {
              await createPaymentFnAsync(paymentData[i]);
            }
            navigate(`/usuarios/${id}/detalles`);
          }
        },
      });

      return;
    }

    const contractData: CreateContractRequest = buildContractData(
      Number(id),
      data,
      getValues,
    );

    createContractMutation.mutate(contractData, {
      onSuccess: (data) => {
        const contract = data.data.data;
        createContractBillFn(contract.id_contrato, {
          onSuccess: async (data) => {
            const billId = data.data.data.id_factura;
            const paymentData: Omit<Payment, "id_pago">[] = getValues(
              "payments",
            ).map((p) => ({
              id_factura: billId,
              id_metodo_pago: p.paymentMethod,
              valor: p.amount,
              fecha_pago: dayjs(p.paymentDate).format("YYYY-MM-DD"),
              id_tipo_pago: 1,
            }));
            for (let i = 0; i < paymentData.length; i++) {
              await createPaymentFnAsync(paymentData[i]);
            }
            navigate(`/usuarios/${id}/detalles`);
          },
        });
      },
    });
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
    if (contract?.data) {
      const formValues = convertContractData(contract.data, startingServices);
      const { services } = formValues;
      let newServices: Service[] = [...services];

      const careService = services.find((e) => e.key === "1");
      const transportService = services.find((e) => e.key === "2");
      const dayService = services.find((e) => e.key === "3");

      if (!careService)
        newServices = [
          ...services,
          {
            ...startingServices[0],
            startDate: dayjs(contract.data.fecha_inicio),
            endDate: dayjs(contract.data.fecha_inicio).add(1, "month"),
          },
        ];
      if (!transportService)
        newServices = [
          ...services,
          {
            ...startingServices[1],
            startDate: dayjs(contract.data.fecha_inicio),
            endDate: dayjs(contract.data.fecha_inicio).add(1, "month"),
          },
        ];
      if (!dayService)
        newServices = [
          ...services,
          {
            ...startingServices[2],
            serviceType: "",
            startDate: dayjs(contract.data.fecha_inicio),
            endDate: dayjs(contract.data.fecha_inicio).add(1, "month"),
          },
        ];
      formValues.services = newServices;

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
      <Card variant="borderless">
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
      <Card variant="borderless" style={{ marginTop: 24, textAlign: "right" }}>
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
          loading={
            createContractMutation.isPending ||
            createContractPending ||
            createPaymentPending
          }
          onClick={handleSubmit(onSubmit)}
        >
          Guardar y Continuar
        </Button>
      </Card>
    </FormProvider>
  );
};
