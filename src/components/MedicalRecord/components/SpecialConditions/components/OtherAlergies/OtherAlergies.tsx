import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useEffect } from "react";
import { Controller, type UseFieldArrayAppend, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";
import { type FormValues, otherAlergies } from "../../../../schema/schema";

type OtherAlergiesForm = z.infer<typeof otherAlergies>;

interface OtherAlergiesModalProps {
  open: boolean;
  editingIndex: number | null;
  initialData: OtherAlergiesForm | null;
  append: UseFieldArrayAppend<FormValues>;
  update: (index: number, value: OtherAlergiesForm) => void;
  onCancel: () => void;
}

export const OtherAlergiesModal = ({
  open,
  editingIndex,
  initialData,
  append,
  update,
  onCancel,
}: OtherAlergiesModalProps) => {
  const { control, handleSubmit, reset } = useForm<OtherAlergiesForm>({
    resolver: zodResolver(otherAlergies),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        alergy: undefined,
      });
  }, [initialData, reset]);

  const onSubmit = (data: OtherAlergiesForm) => {
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
            <Form.Item label="Alergias">
              <Controller
                name="alergy"
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
