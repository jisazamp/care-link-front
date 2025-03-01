import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import { FormValues, vaccineSchema } from "../../../../schema/schema";
import { useEffect } from "react";
import { useForm, UseFieldArrayAppend, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditVaccine } from "../../../../../../hooks/useEditVaccine/useEditVaccine";
import { UserVaccine } from "../../../../../../types";

type VaccinesForm = z.infer<typeof vaccineSchema>;

interface VaccinesModalProps {
  open: boolean;
  editingIndex: number | null;
  initialData: VaccinesForm | null;
  append: UseFieldArrayAppend<FormValues>;
  update: (index: number, value: VaccinesForm) => void;
  onCancel: () => void;
}

export const VaccinesModal = ({
  open,
  editingIndex,
  initialData,
  append,
  update,
  onCancel,
}: VaccinesModalProps) => {
  const { control, handleSubmit, reset } = useForm<VaccinesForm>({
    resolver: zodResolver(vaccineSchema),
    defaultValues: initialData || {},
  });

  const editMutation = useEditVaccine();

  useEffect(() => {
    if (initialData) reset(initialData);
    else
      reset({
        date: undefined,
        nextDate: undefined,
        name: "",
        secondaryEffects: "",
      });
  }, [initialData, reset]);

  const onSubmit = async (data: VaccinesForm) => {
    if (editingIndex !== null) {
      update(editingIndex, {
        ...data,
        id: initialData?.id || uuidv4(),
      });
      if (initialData?.id && typeof initialData.id === "number") {
        const vaccine: UserVaccine = {
          efectos_secundarios: data.secondaryEffects,
          fecha_administracion: data.date?.format("YYYY-MM-DD"),
          fecha_proxima: data.nextDate?.format("YYYY-MM-DD"),
          vacuna: data.name,
        };
        await editMutation.mutateAsync({ vaccine, id: Number(initialData.id) });
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
            <Form.Item label="Vacuna">
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Fecha de administración">
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    placeholder="DD-MM-YYYY"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Próxima aplicación (si aplica)">
              <Controller
                name="nextDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    placeholder="DD-MM-YYYY"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Efectos secundarios">
              <Controller
                name="secondaryEffects"
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
