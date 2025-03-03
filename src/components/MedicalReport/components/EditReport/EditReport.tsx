import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { ClinicalEvolution } from "../../../../types";
import { UserOutlined } from "@ant-design/icons";
import { useCreateClinicalEvolution } from "../../../../hooks/useCreateClinicalEvolution/useCreateClinicalEvolution";
import { useGetClinicalEvolutions } from "../../../../hooks/useGetClinicalEvolutions/useGetClinicalEvolutions";
import { useGetMedicalReport } from "../../../../hooks/useGetMedicalReport/useGetMedicalReport";
import { useGetProfessionals } from "../../../../hooks/useGetProfessionals/useGetProfessionals";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";
import { useParams } from "react-router-dom";
import { useEditClinicalEvolution } from "../../../../hooks/useEditClinicalEvolution/useEditClinicalEvolution";

const { Text } = Typography;

export const EditReport: React.FC = () => {
  const { reportId, id } = useParams();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const clinicalEvolutionMutation = useCreateClinicalEvolution(reportId);
  const editEvolutionMutation = useEditClinicalEvolution();
  const userQuery = useGetUserById(id);
  const reportQuery = useGetMedicalReport(reportId);
  const evolutionsQuery = useGetClinicalEvolutions(reportId);
  const professionalsQuery = useGetProfessionals();
  const user = userQuery.data?.data.data;
  const report = reportQuery.data?.data.data;
  const evolutions = evolutionsQuery.data?.data.data;
  const professionals = professionalsQuery.data?.data.data;

  const handleFinish = (values: {
    date: Dayjs;
    observation: string;
    professional: number;
    reportType: string;
  }) => {
    const clinicalEvolution: Omit<
      ClinicalEvolution,
      "id_TipoReporte" | "profesional"
    > = {
      fecha_evolucion: values.date.format("YYYY-MM-DD"),
      id_profesional: values.professional,
      id_reporteclinico: Number(reportId),
      observacion_evolucion: values.observation,
      tipo_report: values.reportType,
    };
    if (!editingId) {
      clinicalEvolutionMutation.mutate(clinicalEvolution, {
        onSuccess: () => {
          form.resetFields();
        },
      });
      return;
    }
    editEvolutionMutation.mutate(
      {
        data: clinicalEvolution,
        evolutionId: editingId,
      },
      {
        onSuccess: () => {
          setEditingId(null);
          form.resetFields();
        },
      }
    );
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "100%",
        minHeight: "100vh",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Card
        style={{ width: "100%", marginBottom: 16 }}
        loading={userQuery.isLoading}
      >
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar size={80} icon={<UserOutlined />} />
          </Col>
          <Col flex="auto">
            <Typography.Title
              level={4}
            >{`${user?.nombres} ${user?.apellidos}`}</Typography.Title>
            <Text strong>{user?.n_documento}</Text> - {user?.genero} -{" "}
            {dayjs(user?.fecha_nacimiento).format("DD-MM-YYYY")} -{" "}
            <Text strong>
              {dayjs().diff(dayjs(user?.fecha_nacimiento), "years")} años
            </Text>
            <br />
            {user?.estado_civil}
            <br />
            <Text>{user?.direccion}</Text>
            <br />
            {user?.telefono} - {user?.email}
          </Col>
        </Row>
      </Card>
      <Card
        style={{ marginBottom: 16, width: "100%" }}
        loading={reportQuery.isLoading}
      >
        <Text strong>Asociado a:</Text> Reporte clínico #{reportId} -{" "}
        <Text strong>Realizado por:</Text>{" "}
        {`${report?.profesional?.nombres} ${report?.profesional?.apellidos}`}
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card style={{ backgroundColor: "#f5f5f5", borderRadius: 8 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Motivo de consulta:</Text>
                  <p>{report?.motivo_consulta}</p>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Diagnóstico:</Text>
                  <p>{report?.diagnostico}</p>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Remisión:</Text>
                  <p>{report?.remision.toUpperCase()}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
      <Card
        title="Datos del Reporte de Evolución"
        style={{ marginBottom: 16, width: "100%" }}
      >
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Profesional"
                name="professional"
                rules={[{ required: true }]}
              >
                <Select
                  loading={professionalsQuery.isLoading}
                  showSearch
                  filterOption={(input, option) =>
                    !!option?.label.toLowerCase().includes(input)
                  }
                  options={
                    professionals?.map((p) => ({
                      label: `${p.nombres} ${p.apellidos}`,
                      value: p.id_profesional,
                    })) ?? []
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tipo de reporte"
                name="reportType"
                rules={[{ required: true }]}
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
            <Col span={24}>
              <Form.Item
                label="Fecha de registro"
                name="date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Observación"
                name="observation"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Flex style={{ width: "100%" }} justify="flex-end" gap={8}>
              <Button className="main-button-white">Restablecer</Button>
              <Button
                disabled={clinicalEvolutionMutation.isPending}
                htmlType="submit"
                loading={clinicalEvolutionMutation.isPending}
                type="primary"
              >
                Guardar
              </Button>
            </Flex>
          </Row>
        </Form>
      </Card>
      {evolutions?.map((e, idx) => (
        <Card
          key={e.id_TipoReporte}
          title={`Evolución clínica #${idx + 1}`}
          style={{ marginBottom: 16, width: "100%" }}
        >
          <Form layout="vertical" onFinish={handleFinish}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Profesional"
                  name="professional"
                  initialValue={e.id_profesional}
                  rules={[{ required: true }]}
                >
                  <Select
                    disabled={editingId !== e.id_TipoReporte}
                    loading={professionalsQuery.isLoading}
                    showSearch
                    filterOption={(input, option) =>
                      !!option?.label.toLowerCase().includes(input)
                    }
                    options={
                      professionals?.map((p) => ({
                        label: `${p.nombres} ${p.apellidos}`,
                        value: p.id_profesional,
                      })) ?? []
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Tipo de reporte"
                  name="reportType"
                  initialValue={e.tipo_report.toUpperCase()}
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Seleccione el tipo de reporte"
                    disabled={editingId !== e.id_TipoReporte}
                  >
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
              <Col span={24}>
                <Form.Item
                  label="Fecha de registro"
                  name="date"
                  initialValue={dayjs(e.fecha_evolucion)}
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    disabled={editingId !== e.id_TipoReporte}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Observación"
                  name="observation"
                  initialValue={e.observacion_evolucion}
                  rules={[{ required: true }]}
                >
                  <Input.TextArea
                    rows={4}
                    disabled={editingId !== e.id_TipoReporte}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Flex style={{ width: "100%" }} justify="flex-end">
                {editingId === e.id_TipoReporte ? (
                  <Flex gap={8}>
                    <Button
                      onClick={handleCancel}
                      className="main-button-white"
                      disabled={editEvolutionMutation.isPending}
                    >
                      Cancelar
                    </Button>
                    <Button
                      disabled={editEvolutionMutation.isPending}
                      htmlType="submit"
                      loading={editEvolutionMutation.isPending}
                      type="primary"
                    >
                      Guardar
                    </Button>
                  </Flex>
                ) : (
                  <Button onClick={() => handleEdit(e.id_TipoReporte)}>
                    Editar
                  </Button>
                )}
              </Flex>
            </Row>
          </Form>
        </Card>
      ))}
    </div>
  );
};
