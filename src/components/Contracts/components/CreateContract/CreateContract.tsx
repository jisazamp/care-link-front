import { useState } from "react";
import { Layout, Card, Form, Select, DatePicker, Button } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";

const { Option } = Select;

interface ContractData {
  contractType: string;
  startDate: string;
  endDate: string;
  billed: string;
}

export const CreateContract = ({
  onNext,
}: {
  onNext: (contractData: ContractData) => void;
}) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [contractType, setContractType] = useState<string | null>(null);
  const [billed, setBilled] = useState<string | null>(null);

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      setStartDate(date);
      setEndDate(date.add(1, "month"));
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleNext = () => {
    if (startDate && endDate && contractType && billed) {
      const contractData: ContractData = {
        contractType,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        billed,
      };
      onNext(contractData);
    }
  };

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
            <Select placeholder="Seleccione" onChange={setContractType}>
              <Option value="nuevo">Nuevo</Option>
              <Option value="recurrente">Recurrente</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Fecha de inicio"
            name="startDate"
            rules={[
              { required: true, message: "Seleccione la fecha de inicio" },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              value={startDate}
              onChange={handleStartDateChange}
            />
          </Form.Item>

          <Form.Item label="Fecha de finalización" name="endDate">
            <DatePicker
              style={{ width: "100%" }}
              value={endDate}
              disabled
              inputReadOnly
            />
          </Form.Item>

          <Form.Item
            label="Facturado"
            name="billed"
            rules={[{ required: true, message: "Seleccione una opción" }]}
          >
            <Select placeholder="Seleccione" onChange={setBilled}>
              <Option value="si">Sí</Option>
              <Option value="no">No</Option>
            </Select>
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
