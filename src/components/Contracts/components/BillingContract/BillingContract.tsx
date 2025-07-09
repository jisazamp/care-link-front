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
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useCalculatePartialBill } from "../../../../hooks/useCalculatePartialBill";
import { useGetBill } from "../../../../hooks/useGetBill/useGetBill";
import { useGetBillPayments } from "../../../../hooks/useGetBillPayments/useGetBillPayments";
import type { FormValues } from "../FormContracts";
//import { useGetContractBill } from "../../../../hooks/useGetContractBill";
import { PaymentsForm } from "../../../Billing/components/PaymentsForm";
import dayjs from "dayjs";

const { Text } = Typography;

interface BillingContractProps {
  onNext?: () => void;
  onBack?: () => void;
}

export const BillingContract: React.FC<BillingContractProps> = ({
  onNext,
  onBack,
}) => {
  const { contractId } = useParams();
  const { watch, setValue } = useFormContext<FormValues>();
  const { data: bills } = useGetBill(Number(contractId));
  const {  } = useGetBillPayments(
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

  const partialBillFormatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(partialBill?.data?.data ?? 0);

  // Estado local de pagos, siempre array
  const [localPayments, setLocalPayments] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [impuestos, setImpuestos] = useState<number>(0);
  const [descuentos, setDescuentos] = useState<number>(0);

  // Si recibes pagos iniciales, asegúrate de que sea array y filtra nulos
  useEffect(() => {
    setLocalPayments([]); // Inicializa vacío o con datos válidos si los tienes
  }, []);

  // Memoiza los pagos para evitar renders innecesarios
  const pagosMemo = useMemo(() => (localPayments || []).filter(Boolean), [localPayments]);

  // Calcular factura parcial solo cuando cambien los servicios o año
  useEffect(() => {
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

  const handlePaymentsChange = (newPayments: any[]) => {
    const formattedPayments = newPayments.map(p => ({
      paymentMethod: p.id_metodo_pago,
      paymentDate: p.fecha_pago,
      amount: p.valor,
      id_tipo_pago: p.id_tipo_pago
    }));
    setValue("payments", formattedPayments);
    setLocalPayments(newPayments);
  };

  const handleNext = () => {
    // Validar que se hayan configurado los pagos
    if (pagosMemo.length === 0) {
      // Usar message en lugar de Alert.error
      return;
    }
    onNext?.();
  };

  // Generar número de factura temporal
  const numeroFacturaTemporal = useMemo(() => {
    const timestamp = Date.now();
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
                  <Tag color="processing">PENDIENTE</Tag>
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
              totalFactura={partialBill?.data?.data ?? 0}
              initialPayments={pagosMemo}
              onChange={handlePaymentsChange}
              disabled={false}
            />

            {/* Botones de acción */}
            <Row justify="space-between" style={{ marginTop: 24 }}>
              <Col>
                <Button 
                  type="default" 
                  icon={<DownloadOutlined />} 
                  disabled={pagosMemo.length === 0}
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
                        disabled={pagosMemo.length === 0}
                      >
                        Siguiente
                      </Button>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>

            {/* Alertas informativas */}
            {pagosMemo.length === 0 && (
              <Alert
                message="Configuración de Pagos Requerida"
                description="Debe configurar al menos un pago para poder finalizar el contrato."
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            {(partialBill?.data?.data ?? 0) > 0 && pagosMemo.length > 0 && (
              <Alert
                message="Contrato Listo"
                description="El contrato está configurado correctamente. Puede proceder a finalizarlo."
                type="success"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                // Incluir impuestos y descuentos en el payload
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
              <div style={{ margin: '16px 0', fontWeight: 'bold' }}>
                Total calculado: $ {total.toLocaleString()}
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
