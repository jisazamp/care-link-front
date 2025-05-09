import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useEffect } from "react";
import { Controller, type UseFieldArrayAppend, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";
import { type FormValues, dietSchema } from "../../../../schema/schema";

type DietForm = z.infer<typeof dietSchema>;

interface DietModalProps {
  open: boolean;
  editingIndex: number | null;
  initialData: DietForm | null;
  append: UseFieldArrayAppend<FormValues>;
  update: (index: number, value: DietForm) => void;
  onCancel: () => void;
}

export const DietModal = ({
  open,
  editingIndex,
  initialData,
  append,
  update,
  onCancel,
}: DietModalProps) => {
  const { control, handleSubmit, reset } = useForm<DietForm>({
    resolver: zodResolver(dietSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        diet: undefined,
      });
  }, [initialData, reset]);

  const onSubmit = (data: DietForm) => {
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
            <Form.Item label="Dieta">
              <Controller
                name="diet"
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
