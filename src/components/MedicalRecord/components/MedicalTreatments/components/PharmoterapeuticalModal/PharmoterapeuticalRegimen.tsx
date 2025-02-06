import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import { FormValues } from "../../../../MedicalRecord";
import { pharmacotherapeuticRegimenSchema } from "../../../../MedicalRecord";
import { useEffect } from "react";
import { useForm, UseFieldArrayAppend, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type PharmoterapeuticForm = z.infer<typeof pharmacotherapeuticRegimenSchema>;

interface PharmoterapeuticModalProps {
  open: boolean;
  editingIndex: number | null;
  initialData: PharmoterapeuticForm | null;
  append: UseFieldArrayAppend<FormValues>;
  update: (index: number, value: PharmoterapeuticForm) => void;
  onCancel: () => void;
}

export const PharmoterapeuticModal = ({
  open,
  editingIndex,
  initialData,
  append,
  update,
  onCancel,
}: PharmoterapeuticModalProps) => {
  const { control, handleSubmit, reset } = useForm<PharmoterapeuticForm>({
    resolver: zodResolver(pharmacotherapeuticRegimenSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        administration: undefined,
        dose: undefined,
        duration: undefined,
        frequency: undefined,
        id: undefined,
        instructions: undefined,
        medicine: undefined,
        startDate: undefined,
      });
  }, [initialData, reset]);

  const onSubmit = (data: PharmoterapeuticForm) => {
    if (editingIndex !== null) {
      update(editingIndex, {
        ...data,
        id: initialData?.id || uuidv4(),
      });
    } else {
      append({ ...data, id: uuidv4() });
    }
    reset();
    onCancel();
  };

  return (
    <Modal
      open={!!open}
      title={
        editingIndex !== null ? "Editar tratamiento" : "Agregar tratamiento"
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" className="main-button-white" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="confirm" onClick={handleSubmit(onSubmit)}>
          Guardar
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Fecha inicio">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    style={{
                      width: "100%",
                    }}
                    placeholder="DD-MM-YYYY"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Medicamento">
              <Controller
                name="medicine"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Dosis">
              <Controller
                name="dose"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Vía de administración">
              <Controller
                name="administration"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Frecuencia">
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Duración">
              <Controller
                name="duration"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Indicaciones">
              <Controller
                name="instructions"
                control={control}
                render={({ field }) => <Input.TextArea {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
