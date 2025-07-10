# Módulo de Facturación

Este módulo maneja toda la funcionalidad relacionada con la facturación del sistema CareLink.

## Componentes

### Billing.tsx

Componente principal que muestra la vista global de facturación con:

- Lista de todas las facturas del sistema
- Filtros por fecha, estado y contrato
- Estadísticas de facturación
- Acciones para crear, editar y eliminar facturas

### BillingList.tsx

Componente reutilizable para mostrar listas de facturas:

- Tabla con columnas configurables
- Acciones de editar y eliminar
- Paginación y filtros

### BillingForm.tsx

Formulario para crear y editar facturas:

- Validación de campos obligatorios
- Transformación automática de fechas
- Integración con hooks de mutación

### BillingDetails.tsx

Vista detallada de una factura específica:

- Información completa de la factura
- Lista de pagos asociados
- Acciones para gestionar pagos

### PaymentsTable.tsx

Tabla especializada para mostrar pagos:

- Lista de pagos de una factura
- Acciones para eliminar pagos

## Componentes de Soporte

### BillingBreadcrumb.tsx

Navegación de breadcrumbs para el módulo de facturación.

### BillingStats.tsx

Estadísticas visuales de facturación:

- Total de facturas
- Facturas por estado
- Valores totales y pendientes
- Progreso de facturas pagadas

### BillingFilters.tsx

Filtros avanzados para la lista de facturas:

- Rango de fechas
- Estado de factura
- Búsqueda por contrato

## Hooks

- `useGetFacturas`: Obtener lista de facturas (global o por contrato)
- `useGetFacturaById`: Obtener factura específica
- `useCreateFactura`: Crear nueva factura
- `useUpdateFactura`: Actualizar factura existente
- `useDeleteFactura`: Eliminar factura

## Integración

### En Detalle de Contrato

El módulo se integra en `ContractDetails.tsx` para mostrar las facturas asociadas a un contrato específico.

### Vista Global

La página principal `/facturacion` muestra todas las facturas del sistema con filtros y estadísticas.

## Patrones de Diseño

- **Modularidad**: Cada componente tiene una responsabilidad específica
- **Reutilización**: Los componentes se pueden usar en diferentes contextos
- **Centralización**: Los hooks centralizan la lógica de datos
- **Consistencia**: Sigue los mismos patrones que otros módulos del sistema

## Uso

```tsx
import { Billing, BillingList, BillingForm } from '../components/Billing';

// Vista global
<Billing />

// Lista de facturas en detalle de contrato
<BillingList
  facturas={facturas}
  onView={handleView}
  onDelete={handleDelete}
/>

// Formulario modal
<BillingForm
  initialValues={factura}
  onSubmit={handleSubmit}
/>
```
