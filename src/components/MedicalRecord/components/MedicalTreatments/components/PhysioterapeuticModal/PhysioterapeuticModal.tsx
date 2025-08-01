import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useEffect } from "react";
import { Controller, type UseFieldArrayAppend, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";
import { useEditIntervention } from "../../../../../../hooks/useEditIntervention/useEditIntervention";
import type { UserIntervention } from "../../../../../../types";
import {
  type FormValues,
  physioterapeuticRegimenSchema,
} from "../../../../schema/schema";

type PhysioterapeuticForm = z.infer<typeof physioterapeuticRegimenSchema>;

interface PhysioterapeuticModalProps {
  open: boolean;
  editingIndex: number | null;
  initialData: PhysioterapeuticForm | null;
  append: UseFieldArrayAppend<FormValues>;
  update: (index: number, value: PhysioterapeuticForm) => void;
  onCancel: () => void;
}

export const PhysioterapeuticModal = ({
  open,
  editingIndex,
  initialData,
  append,
  update,
  onCancel,
}: PhysioterapeuticModalProps) => {
  const { control, handleSubmit, reset } = useForm<PhysioterapeuticForm>({
    resolver: zodResolver(physioterapeuticRegimenSchema),
    defaultValues: initialData || {},
  });

  const editMutation = useEditIntervention();

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        diagnosis: undefined,
        intervention: undefined,
        frequency: undefined,
      });
  }, [initialData, reset]);

  const onSubmit = async (data: PhysioterapeuticForm) => {
    if (editingIndex !== null) {
      update(editingIndex, {
        ...data,
        id: initialData?.id || uuidv4(),
      });
      if (initialData?.id && typeof initialData.id === "number") {
        const intervention: UserIntervention = {
          diagnostico: data.diagnosis,
          frecuencia: data.frequency,
          intervencion: data.intervention,
        };
        await editMutation.mutateAsync({
          intervention: intervention,
          id: Number(initialData.id),
        });
      }
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
        editingIndex !== null ? "Editar intervención fisioterapéutica" : "Agregar intervención fisioterapéutica"
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
            <Form.Item label="Diagnóstico">
              <Controller
                name="diagnosis"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Intervención">
              <Controller
                name="intervention"
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
      </Form>
    </Modal>
  );
};
