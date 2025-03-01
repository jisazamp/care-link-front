import { Button, Col, Form, Input, Modal, Row } from "antd";
import { FormValues, nursingCarePlanSchema } from "../../../../schema/schema";
import { useEffect } from "react";
import { useForm, UseFieldArrayAppend, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditCare } from "../../../../../../hooks/useEditNursing/useEditNursing";
import type { UserCare } from "../../../../../../types";

type NursingCarePlanForm = z.infer<typeof nursingCarePlanSchema>;

interface NursingCarePlanModalProps {
  open: boolean;
  editingIndex: number | null;
  initialData: NursingCarePlanForm | null;
  append: UseFieldArrayAppend<FormValues>;
  update: (index: number, value: NursingCarePlanForm) => void;
  onCancel: () => void;
}

export const NursingCarePlanModal = ({
  open,
  editingIndex,
  initialData,
  append,
  update,
  onCancel,
}: NursingCarePlanModalProps) => {
  const { control, handleSubmit, reset } = useForm<NursingCarePlanForm>({
    resolver: zodResolver(nursingCarePlanSchema),
    defaultValues: initialData || {},
  });

  const editMutation = useEditCare();

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        diagnosis: undefined,
        intervention: undefined,
        frequency: undefined,
      });
  }, [initialData, reset]);

  const onSubmit = async (data: NursingCarePlanForm) => {
    if (editingIndex !== null) {
      update(editingIndex, {
        ...data,
        id: initialData?.id || uuidv4(),
      });
      if (initialData?.id && typeof initialData.id === "number") {
        const care: UserCare = {
          diagnostico: data.diagnosis,
          frecuencia: data.frequency,
          intervencion: data.intervention,
        };
        await editMutation.mutateAsync({ care, id: Number(initialData?.id) });
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
        editingIndex !== null ? "Editar tratamiento" : "Agregar tratamiento"
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" className="main-button-white" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="confirm" onClick={handleSubmit(onSubmit)} loading={editMutation.isPending}>
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
