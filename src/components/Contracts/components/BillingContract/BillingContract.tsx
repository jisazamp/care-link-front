import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Descriptions,
  Tag,
  Alert,
  InputNumber,
  Form,
} from "antd";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useCalculatePartialBill } from "../../../../hooks/useCalculatePartialBill";
import { useGetBill } from "../../../../hooks/useGetBill/useGetBill";
import { useGetBillPayments } from "../../../../hooks/useGetBillPayments/useGetBillPayments";
import { formatCurrency, PaymentFormData } from "../../../../utils/paymentUtils";
import type { FormValues } from "../FormContracts";
import { PaymentsForm } from "../../../Billing/components/PaymentsForm";
import dayjs from "dayjs";
import { getEstadoFactura } from '../../../Billing/components/PaymentSummary/PaymentSummary';

const { Text } = Typography;

interface BillingContractProps {
  payments: PaymentFormData[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentFormData[]>>;
  onNext?: () => void;
  onBack?: () => void;
  onValidPaymentsChange?: (isValid: boolean) => void;
}

export const BillingContract: React.FC<BillingContractProps> = ({
  payments,
  setPayments,
  onNext,
  onBack,
  onValidPaymentsChange,
}) => {
  const { contractId } = useParams();
  const { watch, setValue } = useFormContext<FormValues>();
  const { data: bills } = useGetBill(Number(contractId));
  const { } = useGetBillPayments(
    Number(bills?.data[0]?.id_factura),
  );

  const { calculatePartialBillFn, partialBill, calculatePartialBillPending } =
    useCalculatePartialBill();
  const services = watch("services");
  const contractStartDate = watch("startDate");
  
  // Memoizar arrays para evitar recreaciones constantes
  const selectedServicesIds = useMemo(() => 
    services?.map((s: any) => Number(s.key)) || [], 
    [services]
  );
  const selectedServicesQuantities = useMemo(() => 
    services?.map((s: any) => s.quantity) || [], 
    [services]
  );
  const startingContractYear = useMemo(() => 
    contractStartDate?.year(), 
    [contractStartDate]
  );

  const partialBillFormatted = formatCurrency(partialBill?.data?.data ?? 0);

  // Usar useRef para mantener referencias estables
  const setValueRef = useRef(setValue);
  setValueRef.current = setValue;

  // Estados necesarios para el formulario de impuestos y descuentos
  const [form] = Form.useForm();
  const [impuestos, setImpuestos] = useState<number>(0);
  const [descuentos, setDescuentos] = useState<number>(0);

  // Sincronizar con el formulario principal de React Hook Form
  useEffect(() => {
    setValue("impuestos", impuestos);
  }, [impuestos, setValue]);

  useEffect(() => {
    setValue("descuentos", descuentos);
  }, [descuentos, setValue]);

  // Cargar valores iniciales desde el formulario principal
  useEffect(() => {
    const currentImpuestos = watch("impuestos") ?? 0;
    const currentDescuentos = watch("descuentos") ?? 0;
    setImpuestos(currentImpuestos);
    setDescuentos(currentDescuentos);
  }, [watch]);

  // Función memoizada para calcular factura parcial
  const calculateBill = useCallback(() => {
    if (
      startingContractYear &&
      selectedServicesIds.length > 0 &&
      selectedServicesQuantities.length > 0
    ) {
      calculatePartialBillFn({
        service_ids: selectedServicesIds,
        quantities: selectedServicesQuantities,
        year: startingContractYear,
      });
    }
  }, [startingContractYear, selectedServicesIds, selectedServicesQuantities, calculatePartialBillFn]);

  // Calcular factura parcial solo cuando cambien los servicios o año
  useEffect(() => {
    calculateBill();
  }, [calculateBill]);

  // Función memoizada para manejar cambios en pagos
  const handlePaymentsChange = useCallback((newPayments: any[]) => {
    const formattedPayments = (newPayments || [])
      .filter((p): p is any => p !== undefined && p !== null)
      .map(p => ({
        paymentMethod: p.id_metodo_pago,
        paymentDate: p.fecha_pago,
        amount: p.valor,
        id_tipo_pago: p.id_tipo_pago
      }));
    setValueRef.current("payments", formattedPayments);
  }, []);

  const handleNext = () => {
    onNext?.();
  };

  // Generar número de factura temporal
  const numeroFacturaTemporal = useMemo(() => {
    const random = Math.floor(Math.random() * 1000);
    return `FACT-${startingContractYear}-${String(random).padStart(6, '0')}`;
  }, [startingContractYear]);

  // Calcular fecha de vencimiento (30 días después de la emisión)
  const fechaVencimiento = useMemo(() => {
    if (contractStartDate) {
      return dayjs(contractStartDate).add(30, 'days');
    }
    return dayjs().add(30, 'days');
  }, [contractStartDate]);

  // Cálculo del total en tiempo real
  const subtotal = partialBill?.data?.data ?? 0;
  const total = subtotal + (impuestos || 0) - (descuentos || 0);

  // Calcular pagos y saldo pendiente usando el estado centralizado
  const totalPagado = useMemo(() => {
    return payments.reduce((total, payment) => total + (payment.valor || 0), 0);
  }, [payments]);

  const saldoPendiente = useMemo(() => {
    return Math.max(0, total - totalPagado);
  }, [total, totalPagado]);

  // Calcular estado visual de la factura
  const estadoFactura = getEstadoFactura(saldoPendiente);

  // Verificar si hay pagos válidos
  const hasValidPayments = useMemo(() => {
    return payments.some(
      (payment) =>
        payment.id_metodo_pago &&
        payment.id_tipo_pago &&
        payment.fecha_pago &&
        payment.valor > 0,
    );
  }, [payments]);

  useEffect(() => {
    if (onValidPaymentsChange) {
      onValidPaymentsChange(hasValidPayments);
    }
  }, [hasValidPayments, onValidPaymentsChange]);

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      <Row justify="center">
        <Col span={20}>
          <Card loading={calculatePartialBillPending}>
            {/* Información de la factura */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileTextOutlined style={{ color: '#1890ff' }} />
                  <span>Información de la Factura</span>
                </div>
              }
              style={{ marginBottom: 16 }}
            >
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Número de Factura" span={1}>
                  <Text strong style={{ color: '#1890ff' }}>
                    {numeroFacturaTemporal}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Estado" span={1}>
                  <Tag color={estadoFactura === "PAGADA" ? "green" : "orange"}>
                    {estadoFactura}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Fecha de Emisión" span={1}>
                  {contractStartDate ? dayjs(contractStartDate).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha de Vencimiento" span={1}>
                  {fechaVencimiento.format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Total Calculado" span={2}>
                  <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                    {partialBillFormatted}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Servicios incluidos */}
            <Card 
              title="Servicios Incluidos" 
              style={{ marginBottom: 16 }}
              size="small"
            >
              <Row gutter={16}>
                {services?.map((service: any, index: number) => (
                  <Col span={12} key={index}>
                    <Card size="small" style={{ marginBottom: 8 }}>
                      <Text strong>{service.serviceType}</Text>
                      <br />
                      <Text type="secondary">
                        Cantidad: {service.quantity} días
                      </Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Formulario de pagos */}
            <PaymentsForm
              payments={payments}
              setPayments={setPayments}
              subtotal={subtotal}
              totalFactura={total}
              onChange={handlePaymentsChange}
              disabled={false}
            />

            {/* Botones de acción */}
            <Row justify="space-between" style={{ marginTop: 24 }}>
              <Col>
                <Button 
                  type="default" 
                  icon={<DownloadOutlined />} 
                  disabled={!hasValidPayments}
                >
                  Descargar Factura
                </Button>
              </Col>
              <Col>
                <Row gutter={8}>
                  {onBack && (
                    <Col>
                      <Button onClick={onBack}>
                        Atrás
                      </Button>
                    </Col>
                  )}
                  {onNext && (
                    <Col>
                      <Button 
                        type="primary" 
                        onClick={handleNext}
                      >
                        Siguiente
                      </Button>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>

            {/* Alertas informativas */}
            {(partialBill?.data?.data ?? 0) > 0 && (
              <Alert
                message="Información de Facturación"
                description="Los pagos son opcionales. Puede configurarlos ahora o más tarde."
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={() => {
                if (onNext) {
                  onNext();
                }
              }}
            >
              <Form.Item label="Impuestos" name="impuestos">
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="0"
                  value={impuestos}
                  onChange={(v) => setImpuestos(Number(v) || 0)}
                />
              </Form.Item>
              <Form.Item label="Descuentos" name="descuentos">
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="0"
                  value={descuentos}
                  onChange={(v) => setDescuentos(Number(v) || 0)}
                />
              </Form.Item>
              {/* Eliminado: Total calculado: {formatCurrency(total)} */}
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
