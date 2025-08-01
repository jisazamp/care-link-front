import {
  CalendarOutlined,
  DollarOutlined,
  FileDoneOutlined,
  HomeOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Steps,
  Typography,
  notification,
} from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useEffect, useState, useCallback, useRef } from "react";
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
import type { PaymentFormData } from "../../../utils/paymentUtils";
import type {
  CreateContractRequest,
  Payment,
  UpdateContractRequest,
} from "../../../types";
import { handleContractError } from "../../../utils/errorHandler";
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
  payments: {
    paymentMethod: number | undefined;
    paymentDate: string;
    amount: number;
    id_tipo_pago?: number | undefined;
  }[];
  impuestos?: number;
  descuentos?: number;
}

export const FormContracts = () => {
  const { id, contractId } = useParams();
  const navigate = useNavigate();

  const { data: contract } = useGetContractById(contractId);
  const { mutate: updateContract } = useUpdateContract(contractId);

  // ESTADO CENTRALIZADO DE PAGOS
  const [payments, setPayments] = useState<PaymentFormData[]>([]);

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
  const createContractMutation = useCreateContract();
  const { createContractBillFn, createContractPending } = useCreateBill();
  const {
    createPaymentPending,
    addPaymentsToFacturaFnAsync,
    addPaymentsToFacturaPending,
  } = useCreatePayment();
  const { contractBillData } = useGetContractBill(Number(contractId));
  const { data: paymentMethodsData } = useGetPaymentMethods();
  const { data: billPayments } = useGetBillPayments(
    Number(contractBillData?.data.data.id_factura),
  );

  // Sincronizar pagos centralizados con el formulario
  useEffect(() => {
    const formattedPayments = payments.map((p) => ({
      paymentMethod: p.id_metodo_pago,
      paymentDate: p.fecha_pago,
      amount: p.valor,
      id_tipo_pago: p.id_tipo_pago,
    }));
    setValue("payments", formattedPayments);
  }, [payments, setValue]);

  // Usar useRef para mantener referencias estables
  const setValueRef = useRef(setValue);
  const resetRef = useRef(reset);
  setValueRef.current = setValue;
  resetRef.current = reset;

  // Función memoizada para actualizar servicios cuando cambia startDate
  const updateServicesWithStartDate = useCallback(
    (newStartDate: Dayjs) => {
      if (!contractId) {
        const newServices: Service[] = startingServices.map((s) => ({
          ...s,
          startDate: newStartDate,
          endDate: newStartDate.add(1, "month"),
        }));
        setValueRef.current("services", newServices);
      }
    },
    [contractId],
  );

  useEffect(() => {
    if (startDate && startDate.isValid()) {
      updateServicesWithStartDate(startDate);
    }
  }, [startDate, updateServicesWithStartDate]);

  // Función memoizada para procesar datos del contrato
  const processContractData = useCallback((contractData: any) => {
    const formValues = convertContractData(contractData, startingServices);
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
          startDate: dayjs(contractData.fecha_inicio),
          endDate: dayjs(contractData.fecha_inicio).add(1, "month"),
        },
      ];
    if (!transportService)
      newServices = [
        ...services,
        {
          ...startingServices[1],
          startDate: dayjs(contractData.fecha_inicio),
          endDate: dayjs(contractData.fecha_inicio).add(1, "month"),
        },
      ];
    if (!dayService)
      newServices = [
        ...services,
        {
          ...startingServices[2],
          serviceType: "",
          startDate: dayjs(contractData.fecha_inicio),
          endDate: dayjs(contractData.fecha_inicio).add(1, "month"),
        },
      ];
    formValues.services = newServices;

    resetRef.current(formValues);
  }, []);

  useEffect(() => {
    if (contract?.data) {
      processContractData(contract.data);
    }
  }, [contract?.data, processContractData]);

  // Función memoizada para manejar el siguiente paso del CreateContract
  const handleCreateContractNext = useCallback((data: any) => {
    setValueRef.current("startDate", data.startDate);
    setValueRef.current("endDate", data.endDate);
    setCurrentStep(1);
  }, []);

  // Función memoizada para manejar el siguiente paso del ServicesContract
  const handleServicesContractNext = useCallback((services: Service[]) => {
    setValueRef.current("services", services);
    setCurrentStep(2);
  }, []);

  // Función memoizada para manejar el paso anterior del ServicesContract
  const handleServicesContractBack = useCallback(() => {
    setCurrentStep(0);
  }, []);

  // Función memoizada para manejar el siguiente paso del BillingContract
  const handleBillingContractNext = useCallback(() => {
    setCurrentStep(3);
  }, []);

  // Función memoizada para manejar el paso anterior del BillingContract
  const handleBillingContractBack = useCallback(() => {
    setCurrentStep(1);
  }, []);

  // Función memoizada para manejar el paso anterior del AgendaSettingsContract
  const handleAgendaSettingsContractBack = useCallback(() => {
    setCurrentStep(2);
  }, []);

  // Verificar si hay pagos válidos (lógica centralizada)
  const hasValidPayments = payments.some(
    (payment) =>
      payment.id_metodo_pago &&
      payment.id_tipo_pago &&
      payment.fecha_pago &&
      payment.valor > 0,
  );

  const onSubmit = async (data: FormValues) => {
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
            const validPayments = newPayments.filter(
              (p) =>
                typeof p.paymentMethod === "number" &&
                p.paymentMethod > 0 &&
                p.amount > 0,
            );

            const paymentData: Omit<Payment, "id_pago">[] = validPayments.map(
              (p) => {
                const metodoPago = paymentMethodsData?.find(
                  (m: { id_metodo_pago: number; nombre: string }) =>
                    m.nombre === `${p.paymentMethod}`,
                );

                return {
                  id_factura: billId,
                  id_metodo_pago: (metodoPago?.id_metodo_pago ?? 1) as number,
                  valor: p.amount,
                  fecha_pago: dayjs(p.paymentDate).format("YYYY-MM-DD"),
                  id_tipo_pago: p.id_tipo_pago || 2, // Usar el valor real seleccionado por el usuario
                };
              },
            );

            // Usar el nuevo endpoint para agregar pagos a la factura
            if (paymentData.length > 0) {
              const paymentsForFactura = paymentData.map((p) => ({
                id_metodo_pago: p.id_metodo_pago,
                id_tipo_pago: p.id_tipo_pago,
                fecha_pago: dayjs(p.fecha_pago).format("YYYY-MM-DD"),
                valor: Number(p.valor),
              }));

              await addPaymentsToFacturaFnAsync({
                facturaId: billId,
                payments: paymentsForFactura,
              });
            }
            navigate(`/usuarios/${id}/detalles`);
          }
        },
        onError: (error: any) => {
          const errorMsg = handleContractError(error);
          notification.error({
            message: "Error al actualizar contrato",
            description: errorMsg,
          });
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
        // Obtener los valores actuales del formulario
        const impuestos = getValues("impuestos") ?? 0;
        const descuentos = getValues("descuentos") ?? 0;
        createContractBillFn(
          {
            contractId: contract.id_contrato,
            impuestos,
            descuentos,
            observaciones: "Factura generada automáticamente desde el contrato",
          },
          {
            onSuccess: async (data) => {
              const billId = data.data.data.id_factura;
              const validPayments = getValues("payments").filter(
                (p) =>
                  typeof p.paymentMethod === "number" &&
                  p.paymentMethod > 0 &&
                  p.amount > 0,
              );

              const paymentData: Omit<Payment, "id_pago">[] = validPayments.map(
                (p) => ({
                  id_factura: billId,
                  id_metodo_pago: p.paymentMethod as number,
                  valor: p.amount,
                  fecha_pago: dayjs(p.paymentDate).format("YYYY-MM-DD"),
                  id_tipo_pago: p.id_tipo_pago || 2, // Usar el valor real seleccionado por el usuario
                }),
              );

              // Usar el nuevo endpoint para agregar pagos a la factura
              if (paymentData.length > 0) {
                const paymentsForFactura = paymentData.map((p) => ({
                  id_metodo_pago: p.id_metodo_pago,
                  id_tipo_pago: p.id_tipo_pago,
                  fecha_pago: dayjs(p.fecha_pago).format("YYYY-MM-DD"),
                  valor: Number(p.valor),
                }));

                await addPaymentsToFacturaFnAsync({
                  facturaId: billId,
                  payments: paymentsForFactura,
                });
              }
              navigate(`/usuarios/${id}/detalles`);
            },
          },
        );
      },
      onError: (error: any) => {
        const errorMsg = handleContractError(error);
        notification.error({
          message: "Error al crear contrato",
          description: errorMsg,
        });
      },
    });
  };

  const steps = [
    {
      title: !contractId ? "Crear contrato" : "Editar contrato",
      icon: <FileDoneOutlined />,
      content: <CreateContract onNext={handleCreateContractNext} />,
    },
    {
      title: "Detalle de servicios",
      icon: <SolutionOutlined />,
      content: (
        <ServicesContract
          onNext={handleServicesContractNext}
          onBack={handleServicesContractBack}
        />
      ),
    },
    {
      title: "Facturación",
      icon: <DollarOutlined />,
      content: (
        <BillingContract
          payments={payments}
          setPayments={setPayments}
          onNext={handleBillingContractNext}
          onBack={handleBillingContractBack}
          onValidPaymentsChange={() => {
            // Eliminar logs de debug
          }}
        />
      ),
    },
    {
      title: "Configuración y Agenda",
      icon: <CalendarOutlined />,
      content: (
        <AgendaSettingsContract onBack={handleAgendaSettingsContractBack} />
      ),
    },
  ];

  const resetAll = () => {
    reset();
    setCurrentStep(0);
    setPayments([]); // Resetear pagos centralizados
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
          disabled={currentStep === 2 && !hasValidPayments}
          loading={
            createContractMutation.isPending ||
            createContractPending ||
            createPaymentPending ||
            addPaymentsToFacturaPending
          }
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        >
          Guardar y Continuar
        </Button>
      </Card>
    </FormProvider>
  );
};
