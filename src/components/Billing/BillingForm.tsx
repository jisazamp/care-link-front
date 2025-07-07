import React, { useEffect } from "react";
import { Form, Input, InputNumber, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import type { Bill } from "../../types";

interface BillingFormProps {
  initialValues?: Partial<Bill>;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

export const BillingForm: React.FC<BillingFormProps> = ({
  initialValues,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();

  // Convertir fechas string a objetos dayjs para los valores iniciales
  const processedInitialValues = React.useMemo(() => {
    if (!initialValues) return undefined;
    
    return {
      ...initialValues,
      fecha_emision: initialValues.fecha_emision && initialValues.fecha_emision !== 'null' && initialValues.fecha_emision !== ''
        ? dayjs(initialValues.fecha_emision) 
        : undefined,
      fecha_vencimiento: initialValues.fecha_vencimiento && initialValues.fecha_vencimiento !== 'null' && initialValues.fecha_vencimiento !== ''
        ? dayjs(initialValues.fecha_vencimiento) 
        : undefined,
    };
  }, [initialValues]);

  // Establecer valores iniciales cuando cambien
  useEffect(() => {
    if (processedInitialValues) {
      form.setFieldsValue(processedInitialValues);
    } else {
      // Limpiar formulario si no hay valores iniciales
      form.resetFields();
    }
  }, [processedInitialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        const data = {
          ...values,
          id_contrato: initialValues?.id_contrato || values.id_contrato,
          fecha_emision: values.fecha_emision && values.fecha_emision.format
            ? values.fecha_emision.format("YYYY-MM-DD")
            : values.fecha_emision,
          fecha_vencimiento: values.fecha_vencimiento && values.fecha_vencimiento.format
            ? values.fecha_vencimiento.format("YYYY-MM-DD")
            : values.fecha_vencimiento,
        };
        onSubmit(data);
      }}
    >
      <Form.Item
        label="Contrato"
        name="id_contrato"
        rules={[{ required: true, message: "El contrato es obligatorio" }]}
      >
        <InputNumber style={{ width: "100%" }} disabled={!!initialValues?.id_contrato} />
      </Form.Item>
      <Form.Item
        label="Fecha de emisión"
        name="fecha_emision"
        rules={[{ required: true, message: "La fecha de emisión es obligatoria" }]}
      >
        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        label="Fecha de vencimiento"
        name="fecha_vencimiento"
      >
        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        label="Total"
        name="total_factura"
        rules={[{ required: true, message: "El total es obligatorio" }]}
      >
        <InputNumber style={{ width: "100%" }} min={0} />
      </Form.Item>
      <Form.Item
        label="Observaciones"
        name="observaciones"
      >
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
}; 