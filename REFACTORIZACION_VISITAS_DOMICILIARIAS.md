# Refactorización Completa - Módulos de Visitas Domiciliarias

## Resumen Ejecutivo

Se ha implementado una refactorización completa y organizada de los módulos de visitas domiciliarias para mantener un funcionamiento ordenado y eficiente tanto para la **creación** como para la **edición** de visitas.

## Problemas Identificados y Solucionados

### Problemas Originales

1. **Componente único para ambos casos:** El `HomeVisitWizard` no distinguía entre creación y edición
2. **Lógica duplicada:** Código repetido para manejar diferentes estados
3. **Falta de organización:** No había separación clara de responsabilidades
4. **Manejo de errores inconsistente:** Estados de error no unificados
5. **Validaciones confusas:** Reglas diferentes según el modo no claramente definidas

### Soluciones Implementadas

## 1. Hook Personalizado (`useHomeVisitWizard`)

**Ubicación:** `src/hooks/useHomeVisitWizard/useHomeVisitWizard.ts`

**Funcionalidades:**

- Manejo centralizado de lógica de creación y edición
- Gestión unificada de estados de carga y envío
- Manejo de errores consistente
- Navegación automática según el contexto

**Interfaz:**

```typescript
interface UseHomeVisitWizardReturn {
  isEditing: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  user: any;
  existingVisit: any;
  handleSubmit: (formData: any) => Promise<void>;
  handleCancel: () => void;
}
```

## 2. Componentes de Utilidad

### LoadingState

**Ubicación:** `src/components/HomeVisitWizard/components/LoadingState.tsx`

**Funcionalidades:**

- Loading spinner con mensajes informativos
- Manejo de errores con opción de reintento
- Estado "visita no encontrada" para edición
- Botones de acción contextuales

### WizardNavigation

**Ubicación:** `src/components/HomeVisitWizard/components/WizardNavigation.tsx`

**Funcionalidades:**

- Navegación entre pasos con validaciones
- Estados de envío con loading
- Textos dinámicos según modo (Crear/Actualizar)
- Validaciones de pasos en tiempo real

## 3. Pasos del Wizard Refactorizados

### HomeVisitStep

**Mejoras implementadas:**

- Modo edición con datos pre-cargados
- Validaciones específicas por contexto
- Estados dinámicos de visita
- Alertas informativas según modo
- Colores de estado según tipo de visita

### BillingStep

**Mejoras implementadas:**

- Configuración de facturación solo para creación
- Información de facturación existente para edición
- Cálculo de totales en tiempo real
- Validaciones específicas por modo

## 4. Tipos Centralizados

**Ubicación:** `src/components/HomeVisitWizard/types.ts`

**Beneficios:**

- Tipos TypeScript completos y organizados
- Interfaces reutilizables
- Estados de visita tipados
- Fácil mantenimiento y extensión

## Flujo de Funcionamiento

### 🔄 Modo Creación (`/nueva-visita`)

1. **Carga inicial:** Datos del usuario
2. **Paso 1:** Configuración de visita (fecha, hora, profesional, observaciones)
3. **Paso 2:** Configuración de facturación (impuestos, descuentos, pagos)
4. **Finalización:** Crear visita + factura + pagos

### 🔄 Modo Edición (`/editar-visita/:visitaId`)

1. **Carga inicial:** Datos del usuario + visita existente
2. **Paso 1:** Edición de datos de visita (con validaciones específicas)
3. **Paso 2:** Información de facturación existente (solo lectura)
4. **Finalización:** Actualizar visita existente

## Validaciones Implementadas

### 📝 Creación

- Fecha no puede ser pasada
- Profesional requerido
- Campos obligatorios validados
- Validaciones en tiempo real

### 📝 Edición

- Fecha puede ser pasada (visitas ya programadas)
- Estado se actualiza a "REPROGRAMADA" si cambia fecha/hora
- Validaciones específicas para edición
- Información contextual sobre cambios

## Estados de Visita

- **PENDIENTE:** Visita creada pero no programada
- **PENDIENTE DE PROGRAMACIÓN:** Visita sin fecha/hora
- **REALIZADA:** Visita completada
- **CANCELADA:** Visita cancelada
- **REPROGRAMADA:** Visita con fecha/hora modificada

## Características Principales

### 🏗️ Organización Modular

- Lógica separada en hooks personalizados
- Componentes reutilizables
- Responsabilidades claras
- Fácil mantenimiento

### 🎯 Manejo de Estados

- Estados de carga unificados
- Manejo de errores consistente
- Validaciones por paso
- Feedback visual claro

### 👥 Experiencia de Usuario

- Alertas informativas según el modo
- Validaciones en tiempo real
- Mensajes de éxito/error claros
- Navegación intuitiva

### 🔧 Mantenibilidad

- Código limpio y documentado
- Tipos TypeScript completos
- Fácil extensión de funcionalidades
- Documentación completa

## Rutas Configuradas

```typescript
// Creación
path="/visitas-domiciliarias/usuarios/:id/nueva-visita"
element={<HomeVisitWizard />}

// Edición
path="/visitas-domiciliarias/usuarios/:id/editar-visita/:visitaId"
element={<HomeVisitWizard />}
```

## Archivos Creados/Modificados

### Nuevos Archivos

- `src/hooks/useHomeVisitWizard/useHomeVisitWizard.ts`
- `src/hooks/useHomeVisitWizard/index.ts`
- `src/components/HomeVisitWizard/components/LoadingState.tsx`
- `src/components/HomeVisitWizard/components/WizardNavigation.tsx`
- `src/components/HomeVisitWizard/types.ts`
- `src/components/HomeVisitWizard/README.md`

### Archivos Modificados

- `src/components/HomeVisitWizard/HomeVisitWizard.tsx`
- `src/components/HomeVisitWizard/steps/HomeVisitStep.tsx`
- `src/components/HomeVisitWizard/steps/BillingStep.tsx`

## Beneficios Obtenidos

1. **🎯 Funcionalidad Completa:** Ambos módulos funcionan correctamente
2. **🔧 Código Limpio:** Organización modular y mantenible
3. **👥 UX Mejorada:** Experiencia de usuario consistente
4. **🛡️ Validaciones Robustas:** Reglas claras según contexto
5. **📚 Documentación:** Código bien documentado
6. **🚀 Escalabilidad:** Fácil extensión de funcionalidades

## Resultado Final

La refactorización ha logrado crear un sistema **organizado, mantenible y funcional** que maneja tanto la creación como la edición de visitas domiciliarias de manera eficiente, con una experiencia de usuario consistente y código limpio y documentado.
