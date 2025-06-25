import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Flex, Space, Table, Typography, Collapse } from "antd";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { FormValues } from "../../schema/schema";
import { AlergiesModal } from "./components/AlergiesModal/AlergiesModal";
import { DiagnosticsModal } from "./components/DiagnosticsModal/DiagnosticsModal";
import { DietModal } from "./components/DietModal/DietModal";
import { DisabilityModal } from "./components/DisabilityModal/DisabilityModal";
import { LimitationsModal } from "./components/LimitationsModal/LimitationsModal";
import { OtherAlergiesModal } from "./components/OtherAlergies/OtherAlergies";
import { SurgeriesModal } from "./components/SurgeriesModal/SurgeriesModal";
import { useLocation } from "react-router-dom";

const { Title } = Typography;

interface SpecialConditionsProps {
  activeSubPanel: string | string[];
  setActiveSubPanel: Dispatch<SetStateAction<string | string[]>>;
}

export const SpecialConditions: React.FC<SpecialConditionsProps> = ({ 
  activeSubPanel, 
  setActiveSubPanel 
}) => {
  const { control, watch, setValue } = useFormContext<FormValues>();
  const location = useLocation();
  const [showModal, setShowModal] = useState<
    | "alergies"
    | "diet"
    | "disability"
    | "limitations"
    | "otherAlergies"
    | "surgeries"
    | "diagnostic"
    | null
  >(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    append: appendAlergies,
    update: updateAlergies,
    remove: removeAlergies,
  } = useFieldArray({
    control,
    name: "alergies",
  });

  const {
    append: appendDiet,
    update: updateDiet,
    remove: removeDiet,
  } = useFieldArray({
    control,
    name: "diet",
  });

  const {
    append: appendDisability,
    update: updateDisability,
    remove: removeDisability,
  } = useFieldArray({
    control,
    name: "disabilities",
  });

  const {
    append: appendLimitations,
    update: updateLimitations,
    remove: removeLimitations,
  } = useFieldArray({
    control,
    name: "limitations",
  });

  const {
    append: appendOtherAlergies,
    update: updateOtherAlergies,
    remove: removeOtherAlergies,
  } = useFieldArray({
    control,
    name: "otherAlergies",
  });

  const {
    append: appendSurgeries,
    update: updateSurgeries,
    remove: removeSurgeries,
  } = useFieldArray({
    control,
    name: "surgeries",
  });

  const {
    append: appendDiagnostic,
    update: updateDiagnostic,
    remove: removeDiagnostic,
  } = useFieldArray({
    control,
    name: "diagnostic",
  });

  const selectedValues = watch("specialConditions", []);
  const alergies = watch("alergies") ?? [];
  const diet = watch("diet") ?? [];
  const disability = watch("disabilities") ?? [];
  const limitations = watch("limitations") ?? [];
  const otherAlergies = watch("otherAlergies") ?? [];
  const surgeries = watch("surgeries") ?? [];
  const diagnostic = watch("diagnostic") ?? [];

  // Mapeo de hash a valor del checkbox
  const hashToCheckboxValue: Record<string, string> = {
    "#discapacidad": "disability",
    "#limitaciones": "limitations",
    "#dieta": "diet", 
    "#tratamientos": "alergies",
  };

  // Efecto para manejar navegación directa a hash
  useEffect(() => {
    if (location.hash && hashToCheckboxValue[location.hash]) {
      const checkboxValue = hashToCheckboxValue[location.hash];
      
      // Si el checkbox no está seleccionado, seleccionarlo
      if (!selectedValues.includes(checkboxValue)) {
        const newValues = [...selectedValues, checkboxValue];
        setValue("specialConditions", newValues);
      }
      
      // Abrir el sub-panel correspondiente
      setActiveSubPanel(checkboxValue);
    }
  }, [location.hash, selectedValues, setValue, setActiveSubPanel]);

  const handleCheckboxGroupChange = (values: string[]) => {
    setValue("specialConditions", values);
    
    // Si hay un hash activo, abrir automáticamente el sub-panel correspondiente
    const hashToSubPanel: Record<string, string> = {
      "#discapacidad": "disability",
      "#limitaciones": "limitations", 
      "#dieta": "diet",
      "#tratamientos": "alergies",
    };
    
    if (location.hash && hashToSubPanel[location.hash] && values.includes(hashToSubPanel[location.hash])) {
      setActiveSubPanel(hashToSubPanel[location.hash]);
    }
  };

  return (
    <Card
      title={
        <Flex vertical>
          <Title level={4}>
            Condiciones especiales permanentes preexistentes de cuidado
          </Title>
        </Flex>
      }
      bordered
    >
      <Flex vertical>
        <Title
          level={5}
          className="checkbox-title"
          style={{ marginTop: 0, marginBottom: 15 }}
        >
          Condición especial
        </Title>
        <Controller
          name="specialConditions"
          control={control}
          render={({ field }) => (
            <Checkbox.Group
              {...field}
              value={field.value}
              onChange={(values) => {
                field.onChange(values);
                handleCheckboxGroupChange(values);
              }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <Checkbox value="alergies">Alergias a medicamentos</Checkbox>
              <Checkbox value="diet">Dieta especial</Checkbox>
              <Checkbox value="disability">Persona con discapacidad</Checkbox>
              <Checkbox value="limitations">Limitaciones o apoyos</Checkbox>
              <Checkbox value="otherAlergies">Otras alergias</Checkbox>
              <Checkbox value="surgeries">Cirugías</Checkbox>
              <Checkbox value="diagnostic">
                Diagnóstico cognitivo, psicológico o psiquiátrico vigente
              </Checkbox>
            </Checkbox.Group>
          )}
        />
      </Flex>
      <Flex vertical style={{ marginTop: 8 }}>
        <Collapse 
          bordered={false} 
          style={{ background: "transparent" }}
          activeKey={activeSubPanel}
          onChange={setActiveSubPanel}
        >
          {selectedValues.includes("alergies") && (
            <Collapse.Panel header="Alergias a medicamentos" key="alergies">
              <Card
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    style={{ alignSelf: "flex-end" }}
                    className="main-button-white"
                    onClick={() => {
                      setEditingIndex(null);
                      setShowModal("alergies");
                    }}
                  >
                    Agregar
                  </Button>
                }
                title={
                  <Title level={5} style={{ margin: 0 }}>
                    Alergias a medicamentos
                  </Title>
                }
                style={{ marginBottom: 8 }}
              >
                <Table
                  rowKey="id"
                  columns={[
                    {
                      title: "Medicamentos a los que presenta alergia",
                      dataIndex: "medicine",
                    },
                    {
                      title: "Acciones",
                      key: "acciones",
                      render: (_, __, index) => (
                        <Space>
                          <Button
                            type="link"
                            className="main-button-link"
                            onClick={() => {
                              setEditingIndex(index);
                              setShowModal("alergies");
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            type="link"
                            danger
                            onClick={() => removeAlergies(index)}
                          >
                            Eliminar
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={alergies}
                  pagination={false}
                />
              </Card>
            </Collapse.Panel>
          )}
          {selectedValues.includes("diet") && (
            <Collapse.Panel header="Dieta" key="diet">
              <Card
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    style={{ alignSelf: "flex-end", marginBottom: 8 }}
                    className="main-button-white"
                    onClick={() => {
                      setEditingIndex(null);
                      setShowModal("diet");
                    }}
                  >
                    Agregar
                  </Button>
                }
                title={
                  <Title level={5} style={{ margin: 0 }}>
                    Dieta
                  </Title>
                }
                style={{ marginBottom: 8 }}
              >
                <Table
                  rowKey="id"
                  columns={[
                    {
                      title: "Tipo de dieta",
                      dataIndex: "diet",
                    },
                    {
                      title: "Acciones",
                      key: "acciones",
                      render: (_, __, index) => (
                        <Space>
                          <Button
                            type="link"
                            className="main-button-link"
                            onClick={() => {
                              setEditingIndex(index);
                              setShowModal("diet");
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            type="link"
                            danger
                            onClick={() => removeDiet(index)}
                          >
                            Eliminar
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={diet}
                  pagination={false}
                />
              </Card>
            </Collapse.Panel>
          )}
          {selectedValues.includes("disability") && (
            <Collapse.Panel header="Tipos de discapacidad del paciente" key="disability">
              <Card
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    className="main-button-white"
                    onClick={() => {
                      setEditingIndex(null);
                      setShowModal("disability");
                    }}
                  >
                    Agregar
                  </Button>
                }
                title={
                  <Title level={5} style={{ margin: 0 }}>
                    Tipos de discapacidad del paciente
                  </Title>
                }
                style={{ marginBottom: 8 }}
              >
                <Table
                  rowKey="id"
                  columns={[
                    {
                      title: "Discapacidades",
                      dataIndex: "disability",
                    },
                    {
                      title: "Acciones",
                      key: "acciones",
                      align: "center",
                      render: (_, __, index) => (
                        <Space>
                          <Button
                            type="link"
                            className="main-button-link"
                            onClick={() => {
                              setEditingIndex(index);
                              setShowModal("disability");
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            type="link"
                            danger
                            onClick={() => removeDisability(index)}
                          >
                            Eliminar
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={disability}
                  pagination={false}
                />
              </Card>
            </Collapse.Panel>
          )}
          {selectedValues.includes("limitations") && (
            <Collapse.Panel header="Limitaciones permanentes que requieren apoyos o cuidados" key="limitations">
              <Card
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    className="main-button-white"
                    onClick={() => {
                      setEditingIndex(null);
                      setShowModal("limitations");
                    }}
                  >
                    Agregar
                  </Button>
                }
                title={
                  <Title level={5} style={{ margin: 0 }}>
                    Limitaciones permanentes que requieren apoyos o cuidados
                  </Title>
                }
                style={{ marginBottom: 8 }}
              >
                <Table
                  rowKey="id"
                  columns={[
                    {
                      title: "Limitaciones",
                      dataIndex: "limitation",
                    },
                    {
                      title: "Acciones",
                      key: "acciones",
                      align: "center",
                      render: (_, __, index) => (
                        <Space>
                          <Button
                            type="link"
                            className="main-button-link"
                            onClick={() => {
                              setEditingIndex(index);
                              setShowModal("limitations");
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            type="link"
                            danger
                            onClick={() => removeLimitations(index)}
                          >
                            Eliminar
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={limitations}
                  pagination={false}
                />
              </Card>
            </Collapse.Panel>
          )}
          {selectedValues.includes("otherAlergies") && (
            <Collapse.Panel header="Otras alergias" key="otherAlergies">
              <Card
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    className="main-button-white"
                    onClick={() => {
                      setEditingIndex(null);
                      setShowModal("otherAlergies");
                    }}
                  >
                    Agregar
                  </Button>
                }
                title={
                  <Title level={5} style={{ margin: 0 }}>
                    Otras alergias
                  </Title>
                }
                style={{ marginBottom: 8 }}
              >
                <Table
                  rowKey="id"
                  columns={[
                    {
                      title: "Alergia",
                      dataIndex: "alergy",
                    },
                    {
                      title: "Acciones",
                      key: "acciones",
                      align: "center",
                      render: (_, __, index) => (
                        <Space>
                          <Button
                            type="link"
                            className="main-button-link"
                            onClick={() => {
                              setEditingIndex(index);
                              setShowModal("otherAlergies");
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            type="link"
                            danger
                            onClick={() => removeOtherAlergies(index)}
                          >
                            Eliminar
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={otherAlergies}
                  pagination={false}
                />
              </Card>
            </Collapse.Panel>
          )}
          {selectedValues.includes("surgeries") && (
            <Collapse.Panel header="Historial de cirugías, traumatismos o accidentes" key="surgeries">
              <Card
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    className="main-button-white"
                    onClick={() => {
                      setEditingIndex(null);
                      setShowModal("surgeries");
                    }}
                  >
                    Agregar
                  </Button>
                }
                title={
                  <Title level={5} style={{ margin: 0 }}>
                    Historial de cirugías, traumatismos o accidentes
                  </Title>
                }
                style={{ marginBottom: 8 }}
              >
                <Table
                  rowKey="id"
                  columns={[
                    { title: "Observaciones", dataIndex: "observation" },
                    {
                      title: "Fecha de ocurrencia",
                      dataIndex: "date",
                      render: (_, record) => record.date?.format("YYYY-MM-DD"),
                    },
                    {
                      title: "Acciones",
                      key: "acciones",
                      align: "center",
                      render: (_, __, index) => (
                        <Space>
                          <Button
                            type="link"
                            className="main-button-link"
                            onClick={() => {
                              setEditingIndex(index);
                              setShowModal("surgeries");
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            type="link"
                            danger
                            onClick={() => removeSurgeries(index)}
                          >
                            Eliminar
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={surgeries}
                  pagination={false}
                />
              </Card>
            </Collapse.Panel>
          )}
          {selectedValues.includes("diagnostic") && (
            <Collapse.Panel header="Diagnósticos vigentes" key="diagnostic">
              <Card
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    className="main-button-white"
                    onClick={() => {
                      setEditingIndex(null);
                      setShowModal("diagnostic");
                    }}
                  >
                    Agregar
                  </Button>
                }
                title={
                  <Title level={5} style={{ margin: 0 }}>
                    Diagnósticos vigentes
                  </Title>
                }
                style={{ marginBottom: 8 }}
              >
                <Table
                  rowKey="id"
                  columns={[
                    { title: "Diagnóstico", dataIndex: "diagnostic" },
                    {
                      title: "Acciones",
                      key: "acciones",
                      align: "center",
                      render: (_, __, index) => (
                        <Space>
                          <Button
                            type="link"
                            className="main-button-link"
                            onClick={() => {
                              setEditingIndex(index);
                              setShowModal("diagnostic");
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            type="link"
                            danger
                            onClick={() => removeDiagnostic(index)}
                          >
                            Eliminar
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={diagnostic}
                  pagination={false}
                />
              </Card>
            </Collapse.Panel>
          )}
        </Collapse>
      </Flex>
      <AlergiesModal
        open={showModal === "alergies"}
        editingIndex={editingIndex}
        initialData={editingIndex !== null ? alergies[editingIndex] : null}
        append={appendAlergies}
        update={updateAlergies}
        onCancel={() => {
          setShowModal(null);
          setEditingIndex(null);
        }}
      />
      <DietModal
        open={showModal === "diet"}
        editingIndex={editingIndex}
        initialData={editingIndex !== null ? diet[editingIndex] : null}
        append={appendDiet}
        update={updateDiet}
        onCancel={() => {
          setShowModal(null);
          setEditingIndex(null);
        }}
      />
      <DisabilityModal
        open={showModal === "disability"}
        editingIndex={editingIndex}
        initialData={editingIndex !== null ? disability[editingIndex] : null}
        append={appendDisability}
        update={updateDisability}
        onCancel={() => {
          setShowModal(null);
          setEditingIndex(null);
        }}
      />
      <LimitationsModal
        open={showModal === "limitations"}
        editingIndex={editingIndex}
        initialData={editingIndex !== null ? limitations[editingIndex] : null}
        append={appendLimitations}
        update={updateLimitations}
        onCancel={() => {
          setShowModal(null);
          setEditingIndex(null);
        }}
      />
      <OtherAlergiesModal
        open={showModal === "otherAlergies"}
        editingIndex={editingIndex}
        initialData={editingIndex !== null ? otherAlergies[editingIndex] : null}
        append={appendOtherAlergies}
        update={updateOtherAlergies}
        onCancel={() => {
          setShowModal(null);
          setEditingIndex(null);
        }}
      />
      <SurgeriesModal
        open={showModal === "surgeries"}
        editingIndex={editingIndex}
        initialData={editingIndex !== null ? surgeries[editingIndex] : null}
        append={appendSurgeries}
        update={updateSurgeries}
        onCancel={() => {
          setShowModal(null);
          setEditingIndex(null);
        }}
      />
      <DiagnosticsModal
        open={showModal === "diagnostic"}
        editingIndex={editingIndex}
        initialData={editingIndex !== null ? diagnostic[editingIndex] : null}
        append={appendDiagnostic}
        update={updateDiagnostic}
        onCancel={() => {
          setShowModal(null);
          setEditingIndex(null);
        }}
      />
    </Card>
  );
};
