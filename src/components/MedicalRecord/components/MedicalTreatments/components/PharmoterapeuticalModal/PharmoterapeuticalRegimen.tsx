import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import {
  FormValues,
  pharmacotherapeuticRegimenSchema,
} from "../../../../schema/schema";
import { useEffect } from "react";
import { useForm, UseFieldArrayAppend, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditMedicine } from "../../../../../../hooks/useEditMedicine/useEditMedicine";
import { UserMedicine } from "../../../../../../types";

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

  const editMutation = useEditMedicine();

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        endDate: undefined,
        frequency: undefined,
        id: undefined,
        medicine: undefined,
        startDate: undefined,
      });
  }, [initialData, reset]);

  const onSubmit = async (data: PharmoterapeuticForm) => {
    if (editingIndex !== null) {
      const medicine: UserMedicine = {
        id: initialData?.id ?? uuidv4(),
        medicamento: data.medicine,
        periodicidad: data.frequency,
        Fecha_inicio: data.startDate.format("YYYY-MM-DD"),
        fecha_fin: data.endDate.format("YYYY-MM-DD"),
      };
      update(editingIndex, {
        ...data,
        id: initialData?.id || uuidv4(),
      });
      if (initialData?.id && typeof initialData.id === "number") {
        await editMutation.mutateAsync({
          user: medicine,
          id: initialData?.id ?? 0,
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
        editingIndex !== null ? "Editar tratamiento" : "Agregar tratamiento"
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" className="main-button-white" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button
          key="confirm"
          onClick={handleSubmit(onSubmit)}
          loading={editMutation.isPending}
        >
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
          <Col span={24}>
            <Form.Item label="Fecha fin">
              <Controller
                name="endDate"
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
