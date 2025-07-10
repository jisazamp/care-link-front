# Módulo de Cronograma de Asistencia

## Descripción

Este módulo permite a los profesionales gestionar la asistencia de pacientes mediante un calendario interactivo. Los pacientes se agendan automáticamente cuando se crean contratos con fechas de servicio específicas.

## Características

- **Calendario Interactivo**: Visualización mensual de pacientes agendados
- **Gestión de Estados**: Control de asistencia (Pendiente, Asistió, No Asistió, Cancelado)
- **Estadísticas**: Resumen de pacientes por estado
- **Filtros**: Búsqueda por rango de fechas y estado
- **Modal de Detalles**: Vista detallada de pacientes por fecha

## Componentes

### Cronograma.tsx

Componente principal que integra todos los elementos del módulo.

### CronogramaStats.tsx

Muestra estadísticas resumidas de pacientes por estado de asistencia.

### CronogramaFilters.tsx

Permite filtrar el cronograma por rango de fechas y estado.

### CronogramaBreadcrumb.tsx

Navegación de breadcrumb para el módulo.

## Hooks

### useGetCronogramasPorRango

Obtiene cronogramas en un rango de fechas específico.

### useGetCronogramasPorProfesional

Obtiene cronogramas de un profesional específico.

### useUpdateEstadoAsistencia

Actualiza el estado de asistencia de un paciente.

### useReagendarPaciente

Permite reagendar un paciente a otra fecha.

## Integración con Contratos

Los pacientes se agendan automáticamente cuando:

1. Se crea un contrato con servicios
2. Se definen fechas de servicio en el wizard de contratos
3. El backend genera cronogramas automáticamente

## Estados de Asistencia

- **PENDIENTE**: Paciente agendado, aún no se ha registrado asistencia
- **ASISTIO**: Paciente confirmó asistencia
- **NO_ASISTIO**: Paciente no asistió
- **CANCELADO**: Cita cancelada

## Rutas

- `/cronograma` - Vista principal del cronograma

## Estilos

Los estilos están definidos en `src/index.css` bajo la sección "ESTILOS PARA EL MÓDULO DE CRONOGRAMA".
