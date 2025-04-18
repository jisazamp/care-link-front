import { Button, Col, Form, Input, Modal, Row } from "antd";
import { FormValues, alergiesSchema } from "../../../../schema/schema";
import { useEffect } from "react";
import { useForm, UseFieldArrayAppend, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type AlergiesForm = z.infer<typeof alergiesSchema>;

interface AlergiesModalProps {
  open: boolean;
  editingIndex: number | null;
  initialData: AlergiesForm | null;
  append: UseFieldArrayAppend<FormValues>;
  update: (index: number, value: AlergiesForm) => void;
  onCancel: () => void;
}

export const AlergiesModal = ({
  open,
  editingIndex,
  initialData,
  append,
  update,
  onCancel,
}: AlergiesModalProps) => {
  const { control, handleSubmit, reset } = useForm<AlergiesForm>({
    resolver: zodResolver(alergiesSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        medicine: undefined,
      });
  }, [initialData, reset]);

  const onSubmit = (data: AlergiesForm) => {
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
            <Form.Item label="Medicamento">
              <Controller
                name="medicine"
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
