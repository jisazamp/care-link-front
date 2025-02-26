import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import { FormValues, surgeriesSchema } from "../../../../schema/schema";
import { useEffect } from "react";
import { useForm, UseFieldArrayAppend, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type SurgeriesForm = z.infer<typeof surgeriesSchema>;

interface SurgeriesModalProps {
  open: boolean;
  editingIndex: number | null;
  initialData: SurgeriesForm | null;
  append: UseFieldArrayAppend<FormValues>;
  update: (index: number, value: SurgeriesForm) => void;
  onCancel: () => void;
}

export const SurgeriesModal = ({
  open,
  editingIndex,
  initialData,
  append,
  update,
  onCancel,
}: SurgeriesModalProps) => {
  const { control, handleSubmit, reset } = useForm<SurgeriesForm>({
    resolver: zodResolver(surgeriesSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        date: undefined,
        observation: undefined,
      });
  }, [initialData, reset]);

  const onSubmit = (data: SurgeriesForm) => {
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
            <Form.Item label="Fecha de ocurrencia">
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker {...field} style={{ width: "100%" }} />
                )}
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
