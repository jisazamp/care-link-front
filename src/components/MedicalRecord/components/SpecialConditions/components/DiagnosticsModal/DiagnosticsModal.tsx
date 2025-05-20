import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { type FC, useEffect } from "react";
import { Controller, type UseFieldArrayAppend, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";
import { type FormValues, diagnosticSchema } from "../../../../schema/schema";

type DiagnosticsForm = z.infer<typeof diagnosticSchema>;

interface DiagnosticsModalProps {
  open: boolean;
  editingIndex: number | null;
  initialData: DiagnosticsForm | null;
  append: UseFieldArrayAppend<FormValues>;
  update: (index: number, value: DiagnosticsForm) => void;
  onCancel: () => void;
}

export const DiagnosticsModal: FC<DiagnosticsModalProps> = ({
  open,
  editingIndex,
  initialData,
  append,
  update,
  onCancel,
}) => {
  const { control, handleSubmit, reset } = useForm<DiagnosticsForm>({
    resolver: zodResolver(diagnosticSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        diagnostic: undefined,
      });
  }, [initialData, reset]);

  const onSubmit = (data: DiagnosticsForm) => {
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
            <Form.Item label="Diagnóstico">
              <Controller
                name="diagnostic"
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
