import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { type Dayjs, isDayjs } from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useCreateActivity } from "../../hooks/useCreateActivity/useCreateActivity";
import { useEditActivity } from "../../hooks/useEditActivity/useEditActivity";
import { useGetActivityById } from "../../hooks/useGetActivityById/useGetActivityById";
import { useGetActivityTypes } from "../../hooks/useGetActivityTypes/useGetActivityTypes";
import { useGetProfessionals } from "../../hooks/useGetProfessionals/useGetProfessionals";
import type { Activity } from "../../types";

export const activityFormSchema = z.object({
  comentarios: z.string().nullish(),
  descripcion: z.string().min(1, "La descripción es requerida").nullish(),
  duracion: z.number().nullish(),
  fecha: z.custom<Dayjs>((val) => isDayjs(val), "Fecha incorrecta").nullish(),
  id_profesional: z.number().optional(),
  id_tipo_actividad: z.number().optional(),
  nombre: z.string().min(1, "El nombre es requerido"),
});

export type ActivityFormValues = z.infer<typeof activityFormSchema>;

const { Title } = Typography;

export const CreateActivityForm = () => {
  const { id } = useParams();

  const { data: professionals, isLoading: isLoadingProfessionals } =
    useGetProfessionals();

  const { data: types, isLoading: isLoadingActivityTypes } =
    useGetActivityTypes();

  const { data: activityData, isLoading: isLoadingActivity } =
    useGetActivityById(id);

  const { mutate: createActivity, isPending: isCreateActivityPending } =
    useCreateActivity();

  const { mutate: editActivity, isPending: isEditActivityPending } =
    useEditActivity(id);

  const navigate = useNavigate();
  const activity = activityData?.data.data;

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      fecha: "",
      comentarios: "",
      id_profesional: undefined,
      id_tipo_actividad: undefined,
    },
  });

  const onSubmit = (data: ActivityFormValues) => {
    const activity: Omit<Activity, "id"> = {
      id_profesional: data.id_profesional,
      id_tipo_actividad: data.id_tipo_actividad,
      comentarios: data.comentarios,
      descripcion: data.descripcion,
      duracion: data.duracion,
      fecha: data.fecha?.format("YYYY-MM-DD"),
      nombre: data.nombre,
    };
    if (id) {
      editActivity({ data: activity, id });
      return;
    }
    createActivity(activity, {
      onSuccess: () => {
        navigate("/actividades");
      },
    });
  };

  useEffect(() => {
    if (activity) {
      reset({
        id_profesional: activity.id_profesional,
        id_tipo_actividad: activity.id_tipo_actividad,
        comentarios: activity.comentarios,
        descripcion: activity.descripcion,
        duracion: activity.duracion,
        fecha: activity.fecha ? dayjs(activity.fecha) : undefined,
        nombre: activity.nombre,
      });
    }
  }, [activity, reset]);

  if (isLoadingActivity)
    return (
      <Flex align="center" justify="center" style={{ minHeight: 500 }}>
        <Spin />
      </Flex>
    );

  return (
    <Card
      title={
        <Title level={4}>
          {activity ? "Editar actividad" : "Crear actividad"}
        </Title>
      }
      bordered
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Nombre"
          validateStatus={errors.nombre ? "error" : ""}
          help={errors.nombre?.message}
        >
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Nombre" />}
          />
        </Form.Item>

        <Flex gap={30}>
          <Form.Item
            label="Profesional"
            validateStatus={errors.id_profesional ? "error" : ""}
            help={errors.id_profesional?.message}
            style={{ flex: 1 }}
          >
            <Controller
              name="id_profesional"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Seleccione un profesional"
                  loading={isLoadingProfessionals}
                  showSearch
                  filterOption={(input, option) =>
                    !!option?.label.toLowerCase().includes(input)
                  }
                  options={
                    professionals?.data.data.map((p) => ({
                      label: `${p.nombres} ${p.apellidos}`,
                      value: p.id_profesional,
                    })) ?? []
                  }
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Tipo de Actividad"
            validateStatus={errors.id_tipo_actividad ? "error" : ""}
            help={errors.id_tipo_actividad?.message}
            style={{ flex: 1 }}
          >
            <Controller
              name="id_tipo_actividad"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Seleccione un tipo de actividad"
                  loading={isLoadingActivityTypes}
                  showSearch
                  filterOption={(input, option) =>
                    !!option?.label.toLowerCase().includes(input)
                  }
                  options={
                    types?.data.data.map((p) => ({
                      label: `${p.tipo}`,
                      value: p.id,
                    })) ?? []
                  }
                />
              )}
            />
          </Form.Item>
        </Flex>

        <Form.Item
          label="Descripción"
          validateStatus={errors.descripcion ? "error" : ""}
          help={errors.descripcion?.message}
        >
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                placeholder="Descripción"
                rows={4}
                value={field.value === null ? undefined : field.value}
              />
            )}
          />
        </Form.Item>

        <Flex gap={30}>
          <Form.Item
            label="Duración (minutos)"
            validateStatus={errors.duracion ? "error" : ""}
            help={errors.duracion?.message}
            style={{ flex: 1 }}
          >
            <Controller
              name="duracion"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  placeholder="Duración"
                  style={{ width: "100%" }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Fecha"
            style={{ flex: 1 }}
            validateStatus={errors.fecha ? "error" : ""}
            help={errors.fecha?.message}
          >
            <Controller
              name="fecha"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                />
              )}
            />
          </Form.Item>
        </Flex>

        <Form.Item
          label="Comentarios"
          validateStatus={errors.comentarios ? "error" : ""}
          help={errors.comentarios?.message}
        >
          <Controller
            name="comentarios"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                value={field.value === null ? undefined : field.value}
                placeholder="Comentarios"
                rows={3}
              />
            )}
          />
        </Form.Item>

        <Flex align="flex-end" justify="flex-end">
          <Form.Item>
            <Button
              disabled={isCreateActivityPending || isEditActivityPending}
              htmlType="submit"
              loading={isCreateActivityPending || isEditActivityPending}
              type="primary"
            >
              Guardar cambios
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Card>
  );
};
