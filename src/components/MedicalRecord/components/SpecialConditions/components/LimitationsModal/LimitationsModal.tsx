import { Button, Col, Form, Input, Modal, Row } from "antd";
import { FormValues, limitationsSchema } from "../../../../schema/schema";
import { useEffect } from "react";
import { useForm, UseFieldArrayAppend, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type LimitationsForm = z.infer<typeof limitationsSchema>;

interface LimitationsModalProps {
  open: boolean;
  editingIndex: number | null;
  initialData: LimitationsForm | null;
  append: UseFieldArrayAppend<FormValues>;
  update: (index: number, value: LimitationsForm) => void;
  onCancel: () => void;
}

export const LimitationsModal = ({
  open,
  editingIndex,
  initialData,
  append,
  update,
  onCancel,
}: LimitationsModalProps) => {
  const { control, handleSubmit, reset } = useForm<LimitationsForm>({
    resolver: zodResolver(limitationsSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        limitation: undefined,
        observation: undefined,
      });
  }, [initialData, reset]);

  const onSubmit = (data: LimitationsForm) => {
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
      title={editingIndex !== null ? "Editar alergias" : "Agregar alergias"}
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
            <Form.Item label="Limitación">
              <Controller
                name="limitation"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Observación">
              <Controller
                name="observation"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
