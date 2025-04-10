import { Controller, useFormContext } from "react-hook-form";
import { Dayjs } from "dayjs";
import { FileDoneOutlined } from "@ant-design/icons";
import { FormValues } from "../FormContracts";
import { Layout, Card, Form, Select, DatePicker, Button } from "antd";
import { useEffect } from "react";

const { Option } = Select;

interface ContractData {
  billed: string;
  contractType: string;
  endDate: Dayjs | null;
  startDate: Dayjs | null;
}

export const CreateContract = ({
  onNext,
}: {
  onNext: (contractData: ContractData) => void;
}) => {
  const methods = useFormContext<FormValues>();
  const startDate = methods.watch("startDate");
  const endDate = methods.watch("endDate");
  const contractType = methods.watch('contractType');
  const billed = methods.watch('billed');

  const handleNext = () => {
    if (startDate && endDate && contractType && billed) {
      const contractData: ContractData = {
        contractType,
        startDate,
        endDate,
        billed,
      };
      onNext(contractData);
    }
  };

  useEffect(() => {
    if (startDate) {
      methods.setValue("endDate", startDate.add(1, "month"));
    }
  }, [startDate, methods.setValue]);

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      <Card title="Editar / Agregar Contrato" style={{ marginTop: 16 }}>
        <Form layout="vertical">
          <Form.Item
            label="Tipo de contrato"
            name="contractType"
            rules={[
              { required: true, message: "Seleccione el tipo de contrato" },
            ]}
          >
            <Controller
              control={methods.control}
              name="contractType"
              render={({ field }) => (
                <Select placeholder="Seleccione" {...field}>
                  <Option value="nuevo">Nuevo</Option>
                  <Option value="recurrente">Recurrente</Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Fecha de inicio"
            name="startDate"
            rules={[
              { required: true, message: "Seleccione la fecha de inicio" },
            ]}
          >
            <Controller
              control={methods.control}
              name="startDate"
              render={({ field }) => (
                <DatePicker {...field} style={{ width: "100%" }} />
              )}
            />
          </Form.Item>

          <Form.Item label="Fecha de finalización">
            <Controller
              control={methods.control}
              name="endDate"
              render={({ field }) => (
                <DatePicker
                  {...field}
                  style={{ width: "100%" }}
                  disabled
                  inputReadOnly
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Facturado"
            name="billed"
            rules={[{ required: true, message: "Seleccione una opción" }]}
          >
            <Controller
              control={methods.control}
              name="billed"
              render={({ field }) => (
                <Select placeholder="Seleccione" {...field}>
                  <Option value="si">Sí</Option>
                  <Option value="no">No</Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<FileDoneOutlined />}
              onClick={handleNext}
              disabled={!startDate || !endDate || !contractType || !billed}
            >
              Siguiente
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};
