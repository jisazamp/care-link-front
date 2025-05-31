import { DownloadOutlined } from "@ant-design/icons";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  type FormInstance,
  Input,
  InputNumber,
  Layout,
  Row,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useCalculatePartialBill } from "../../../../hooks/useCalculatePartialBill";
import { useGetBill } from "../../../../hooks/useGetBill/useGetBill";
import { useGetBillPayments } from "../../../../hooks/useGetBillPayments/useGetBillPayments";
import type { FormValues } from "../FormContracts";

interface BillingContractProps {
  onNext?: () => void;
  onBack?: () => void;
}

interface PaymentFormProps {
  form: FormInstance<unknown>;
}

const PaymentForm: React.FC<PaymentFormProps> = () => {
  return (
    <Card title="Formulario de pago" style={{ marginTop: 16 }}>
      <Form.List name="payments">
        {(fields, { add, remove }) => (
          <>
            {!fields.length && (
              <Typography style={{ textAlign: "center" }}>
                No hay pagos registrados
              </Typography>
            )}
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                type="inner"
                title={`Pago ${name + 1}`}
                style={{
                  marginBottom: 16,
                  paddingBottom: 40,
                }}
                extra={
                  fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  )
                }
              >
                <Form.Item
                  {...restField}
                  label="Método de pago"
                  name={[name, "paymentMethod"]}
                  rules={[
                    { required: true, message: "Ingresa un método de pago" },
                  ]}
                  style={{ marginBottom: 40 }}
                >
                  <Input placeholder="Ej. Transferencia, Efectivo" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Fecha de pago"
                  name={[name, "paymentDate"]}
                  rules={[{ required: true, message: "Selecciona una fecha" }]}
                  style={{ marginBottom: 40 }}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  {...restField}
                  label="Monto"
                  name={[name, "amount"]}
                  rules={[{ required: true, message: "Ingresa el monto" }]}
                  style={{ marginBottom: 40 }}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    placeholder="0.00"
                  />
                </Form.Item>
              </Card>
            ))}

            <Form.Item style={{ marginBottom: 40, marginTop: 40 }}>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Agregar otro pago
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Card>
  );
};

export const BillingContract: React.FC<BillingContractProps> = ({
  onNext,
  onBack,
}) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { contractId } = useParams();
  const { watch } = useFormContext<FormValues>();
  const { data: bills } = useGetBill(Number(contractId));
  const { data: payments } = useGetBillPayments(
    Number(bills?.data[0].id_factura),
  );
  const [form] = Form.useForm();

  const { calculatePartialBillFn, partialBill, calculatePartialBillPending } =
    useCalculatePartialBill();
  const services = watch("services");
  const contractStartDate = watch("startDate");
  const selectedServicesIds = services.map((s) => Number(s.key));
  const selectedServicesQuantities = services.map((s) => s.quantity);
  const startingContractYear = contractStartDate?.year();

  const partialBillFormatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(partialBill?.data.data ?? 0);

  useEffect(() => {
    if (payments?.data?.length) {
      form.setFieldsValue({
        payments: payments.data.map((payment) => ({
          paymentMethod: "Efectivo",
          paymentDate: dayjs(payment.fecha_pago),
          amount: payment.valor,
        })),
      });
      setShowPaymentForm(true);
    }
  }, [payments, form.setFieldsValue]);

  useEffect(() => {
    if (
      startingContractYear &&
      selectedServicesIds &&
      selectedServicesQuantities
    ) {
      calculatePartialBillFn({
        service_ids: selectedServicesIds,
        quantities: selectedServicesQuantities,
        year: startingContractYear,
      });
    }
  }, []);

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      <Row justify="center">
        <Col span={18}>
          <Card loading={calculatePartialBillPending}>
            <Form layout="vertical" form={form}>
              <Card>
                <Row justify="space-between" align="middle">
                  <Col>
                    <h3 style={{ margin: 0 }}>
                      Descargar factura ({partialBillFormatted})
                    </h3>
                  </Col>
                  <Col>
                    <Button type="primary" icon={<DownloadOutlined />} disabled>
                      Descargar
                    </Button>
                  </Col>
                </Row>
                <Form.Item style={{ marginTop: 16 }}>
                  <Checkbox
                    checked={showPaymentForm}
                    onChange={(e) => setShowPaymentForm(e.target.checked)}
                  >
                    Registrar pago
                  </Checkbox>
                </Form.Item>
              </Card>

              {showPaymentForm && <PaymentForm form={form} />}
            </Form>
          </Card>

          <Row justify="end" style={{ marginTop: 24 }}>
            {onBack && (
              <Button onClick={onBack} style={{ marginRight: 8 }}>
                Atrás
              </Button>
            )}
            {onNext && (
              <Button type="primary" onClick={onNext}>
                Siguiente
              </Button>
            )}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};
