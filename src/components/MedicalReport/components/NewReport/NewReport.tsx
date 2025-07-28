import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Upload,
} from "antd";
import type { Dayjs } from "dayjs";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateMedicalReport } from "../../../../hooks/useCreateMedicalReport/useCreateMedicalReport";
import { useGetProfessionals } from "../../../../hooks/useGetProfessionals/useGetProfessionals";
import { useGetUserMedicalRecord } from "../../../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import type { MedicalReport } from "../../../../types";
import { useWatch } from "antd/es/form/Form";

export const NewReport: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const reportType = useWatch("reportType", form);

  const createMutation = useCreateMedicalReport(id);
  const medicalRecordQuery = useGetUserMedicalRecord(id);
  const professionalsQuery = useGetProfessionals();

  const handleFinish = async (values: {
    professional: number;
    reportType: string;
    registrationDate: Dayjs;
    consultationReason: string;
    weight: number;
    height: number;
    diagnosis: string;
    internalObservations: string;
    referral: string;
    treatmentObservation: string;
  }) => {
    const medicalReport: Partial<MedicalReport> = {
      id_historiaclinica: Number(
        medicalRecordQuery.data?.data.data?.id_historiaclinica,
      ),
      recomendaciones: values.treatmentObservation,
      diagnosticos: values.diagnosis,
      fecha_registro: values.registrationDate.format("YYYY-MM-DD"),
      id_profesional: values.professional,
      motivo_consulta: values.consultationReason,
      observaciones: values.internalObservations,
      peso: values.weight,
      altura: values.height,
      remision: values.referral,
      tipo_reporte: values.reportType,
    };
    await createMutation.mutateAsync({ data: medicalReport });
  };

  useEffect(() => {
    if (createMutation.isSuccess) {
      navigate(`/usuarios/${id}/detalles`);
    }
  }, [createMutation.isSuccess, id, navigate]);

  return (
    <>
      <Card
        title="Nuevo Reporte Clínico"
        loading={medicalRecordQuery.isLoading}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Card title="Datos básicos del reporte" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Profesional"
                  name="professional"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Select
                    placeholder="Seleccione un profesional"
                    loading={professionalsQuery.isLoading}
                    showSearch
                    filterOption={(input, option) =>
                      !!option?.label.toLowerCase().includes(input)
                    }
                    options={
                      professionalsQuery.data?.data.data.map((p) => ({
                        label: `${p.nombres} ${p.apellidos}`,
                        value: p.id_profesional,
                      })) ?? []
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tipo de Reporte"
                  name="reportType"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Select placeholder="Seleccione el tipo de reporte">
                    <Select.Option value="enfermeria">Enfermería</Select.Option>
                    <Select.Option value="psicologia">Psicología</Select.Option>
                    <Select.Option value="nutricion">Nutrición</Select.Option>
                    <Select.Option value="fisioterapia">
                      Fisioterapia
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Fecha de registro"
                  name="registrationDate"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Motivo de consulta"
                  name="consultationReason"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {reportType && reportType !== "psicologia" && (
            <Card title="Exploración Física" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Peso (kg)" name="weight">
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Estatura (cm)" name="height">
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          <Card title="Datos del diagnóstico" style={{ marginBottom: 16 }}>
            <Form.Item label="Diagnóstico" name="diagnosis">
              <Input />
            </Form.Item>
            <Form.Item
              label="Observaciones internas"
              name="internalObservations"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Remisión" name="referral">
              <Select placeholder="Seleccione una opción">
                <Select.Option value="psicologia">Psicología</Select.Option>
                <Select.Option value="fisioterapia">Fisioterapia</Select.Option>
                <Select.Option value="gerontologia">
                  Gerontologia
                </Select.Option>
                <Select.Option value="enfermeria">
                  Enfermería
                </Select.Option>
                <Select.Option value="especialista">
                  Especialista
                </Select.Option>
              </Select>
            </Form.Item>
          </Card>

          <Card
            title="Tratamientos y recomendaciones"
            style={{ marginBottom: 16 }}
          >
            <Form.Item label="Observación" name="treatmentObservation">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Card>

          <Card title="Adjuntar documentos" style={{ marginBottom: 16 }}>
            <Upload>
              <Button icon={<UploadOutlined />}>Agregar</Button>
            </Upload>
          </Card>

          <Card style={{ width: "100%", textAlign: "right" }}>
            <Button style={{ marginRight: 8 }} className="main-button-white">
              Restablecer
            </Button>
            <Button
              htmlType="submit"
              loading={createMutation.isPending}
              disabled={createMutation.isPending}
            >
              Guardar y continuar
            </Button>
          </Card>
        </Form>
      </Card>
    </>
  );
};
