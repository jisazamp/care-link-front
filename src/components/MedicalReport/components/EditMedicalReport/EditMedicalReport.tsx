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
  message,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useGetMedicalReport } from "../../../../hooks/useGetMedicalReport/useGetMedicalReport";
import { useGetProfessionals } from "../../../../hooks/useGetProfessionals/useGetProfessionals";
import { useGetUserMedicalRecord } from "../../../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import { useUpdateMedicalReport } from "../../../../hooks/useUpdateMedicalReport/useUpdateMedicalReport";
import type { MedicalReport } from "../../../../types";

export const EditMedicalReport: React.FC = () => {
  const { id, reportId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if we're in home visit context
  const isHomeVisit = location.pathname.includes('/visitas-domiciliarias/');

  const [form] = Form.useForm();

  const medicalRecordQuery = useGetUserMedicalRecord(id);
  const professionalsQuery = useGetProfessionals();
  const reportQuery = useGetMedicalReport(reportId);
  const updateMutation = useUpdateMedicalReport();

  const report = reportQuery.data?.data.data;

  // Cargar datos del reporte cuando esté disponible
  useEffect(() => {
    if (report) {
      form.setFieldsValue({
        professional: report.id_profesional,
        reportType: report.tipo_reporte,
        registrationDate: report.fecha_registro ? dayjs(report.fecha_registro) : undefined,
        consultationReason: report.motivo_consulta,
        weight: report.peso,
        height: report.altura,
        diagnosis: report.diagnosticos,
        internalObservations: report.observaciones,
        referral: report.remision,
        treatmentObservation: report.Obs_habitosalimenticios,
      });
    }
  }, [report, form]);

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
    try {
      const medicalReport: Partial<MedicalReport> = {
        id_profesional: values.professional,
        tipo_reporte: values.reportType,
        fecha_registro: values.registrationDate.format("YYYY-MM-DD"),
        motivo_consulta: values.consultationReason,
        peso: values.weight,
        altura: values.height,
        diagnosticos: values.diagnosis,
        observaciones: values.internalObservations,
        remision: values.referral,
        Obs_habitosalimenticios: values.treatmentObservation,
      };

      await updateMutation.mutateAsync({
        reportId: reportId!,
        data: medicalReport,
      });

      message.success("Reporte actualizado correctamente");
      navigate(isHomeVisit ? `/visitas-domiciliarias/usuarios/${id}/detalles` : `/usuarios/${id}/detalles`);
    } catch (error) {
      message.error("Error al actualizar el reporte");
    }
  };

  if (reportQuery.isLoading) {
    return <Card loading={true} />;
  }

  if (!report) {
    return <Card>Reporte no encontrado</Card>;
  }

  return (
    <>
      <Card
        title="Editar Reporte Clínico"
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
                    <Select.Option value="fisioterapia">Fisioterapia</Select.Option>
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
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Datos del diagnóstico" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Peso (kg)"
                  name="weight"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Estatura (cm)"
                  name="height"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Diagnóstico"
                  name="diagnosis"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Observaciones internas"
                  name="internalObservations"
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Remisión"
                  name="referral"
                >
                  <Select placeholder="Seleccione una opción">
                    <Select.Option value="si">Sí</Select.Option>
                    <Select.Option value="no">No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Tratamientos y recomendaciones" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Observación"
                  name="treatmentObservation"
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Adjuntar documentos"
                  name="documents"
                >
                  <Upload>
                    <Button icon={<UploadOutlined />}>Subir archivo</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                Actualizar Reporte
              </Button>
                             <Button onClick={() => navigate(isHomeVisit ? `/visitas-domiciliarias/usuarios/${id}/detalles` : `/usuarios/${id}/detalles`)}>
                 Cancelar
               </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}; 