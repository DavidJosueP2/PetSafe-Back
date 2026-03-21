# PetSafe — TypeORM Entities

Create all TypeORM entities from the database schema. Using TypeORM's built-in `@DeleteDateColumn` for soft delete, an abstract base entity for audit columns, and proper entity classification.

## User Review Required

> [!IMPORTANT]
> **Entity Classification** — Not every table becomes a top-level entity with its own module/service. The classification below defines:
> - **Primary Entity**: Has its own module (service, controller, repo). Queried independently.
> - **Detail Entity**: Managed by its parent module. No independent service. Accessed through parent relations.
> - **Relation Entity**: Join table with extra columns. Managed by one of the related modules.

> [!IMPORTANT]
> **Naming Convention** — Entity class names use PascalCase in English-style (e.g. `Role` not `Rol`), but `@Entity({ name: 'table_name' })` maps to the exact Spanish SQL table name. Properties use camelCase with `@Column({ name: 'snake_case' })`.

---

## Architecture Decisions

### Abstract Base Entity (`BaseAuditEntity`)
Shared by **all** entities that have: `id (uuid)`, `activo`, `created_at`, `updated_at`, `deleted_at`, `deleted_by_usuario_id`.

```typescript
abstract class BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ default: true }) activo: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @DeleteDateColumn() deletedAt: Date | null;       // ← TypeORM soft-delete
  @ManyToOne(() => Usuario) deletedByUsuario: Usuario | null;
}
```

Tables that **don't** fit this pattern get their own audit setup:
- `usuarios_roles` — only `assigned_at`, composite PK
- `pacientes_tutores` — no `updated_at`, composite PK
- `usuarios_refresh_tokens` — no `updated_at`, has `revoked`, `expires_at`

---

## Entity Classification Table

| Table | Entity Class | Type | Module | Reason |
|-------|-------------|------|--------|--------|
| `roles` | `Role` | Primary | `auth` | Independent CRUD |
| `personas` | `Persona` | Primary | `personas` | Base for all people |
| `usuarios` | `Usuario` | Primary | `auth` | Core auth entity |
| `empleados` | `Empleado` | Primary | `personas` | Employee profiles |
| `clientes` | `Cliente` | Primary | `personas` | Client profiles |
| `usuarios_roles` | `UsuarioRol` | **Relation** | `auth` | ManyToMany with `assigned_at` |
| `usuarios_refresh_tokens` | `UsuarioRefreshToken` | **Detail** | `auth` | Token lifecycle tied to user |
| `especies_catalogo` | `EspecieCatalogo` | Primary | `catalogos` | Independent CRUD |
| `razas_catalogo` | `RazaCatalogo` | Primary | `catalogos` | Sub-catalog of especie |
| `colores_catalogo` | `ColorCatalogo` | Primary | `catalogos` | Independent CRUD |
| `vacunas_catalogo` | `VacunaCatalogo` | Primary | `catalogos` | Independent CRUD |
| `catalogo_antiparasitarios` | `AntiparasitarioCatalogo` | Primary | `catalogos` | Independent CRUD |
| `pacientes` | `Paciente` | Primary | `pacientes` | Core clinical entity |
| `pacientes_tutores` | `PacienteTutor` | **Relation** | `pacientes` | ManyToMany with extra cols |
| `pacientes_condiciones` | `PacienteCondicion` | **Detail** | `pacientes` | Child conditions |
| `citas` | `Cita` | Primary | `citas` | Appointment scheduling |
| `cola_atenciones` | `ColaAtencion` | Primary | `citas` | Waiting queue |
| `atenciones` | `Atencion` | Primary | `atenciones` | Clinical encounter |
| `atenciones_motivo_consulta` | `AtencionMotivoConsulta` | **Detail** | `atenciones` | 1:1 sub-form |
| `atenciones_anamnesis` | `AtencionAnamnesis` | **Detail** | `atenciones` | 1:1 sub-form |
| `atenciones_examen_clinico` | `AtencionExamenClinico` | **Detail** | `atenciones` | 1:1 sub-form |
| `atenciones_datos_medioambientales` | `AtencionDatosMedioambientales` | **Detail** | `atenciones` | 1:1 sub-form |
| `atenciones_impresion_clinica` | `AtencionImpresionClinica` | **Detail** | `atenciones` | 1:1 sub-form |
| `atenciones_plan` | `AtencionPlan` | **Detail** | `atenciones` | 1:1 sub-form |
| `tratamientos` | `Tratamiento` | Primary | `atenciones` | Treatment plans |
| `tratamientos_item` | `TratamientoItem` | **Detail** | `atenciones` | Treatment line items |
| `vacunaciones_evento` | `VacunacionEvento` | **Detail** | `atenciones` | Clinical event |
| `desparasitaciones_evento` | `DesparasitacionEvento` | **Detail** | `atenciones` | Clinical event |
| `cirugias` | `Cirugia` | **Detail** | `atenciones` | Surgery record |
| `procedimientos` | `Procedimiento` | **Detail** | `atenciones` | Procedure record |
| `archivos_media` | `ArchivoMedia` | Primary | `media` | File management |

---

## Proposed File Structure

```
src/
  common/
    entities/base-audit.entity.ts       ← Abstract base
    enums/index.ts                      ← All 20 TypeScript enums
  modules/
    auth/
      entities/
        role.entity.ts
        usuario.entity.ts
        usuario-rol.entity.ts
        usuario-refresh-token.entity.ts
    personas/
      entities/
        persona.entity.ts
        empleado.entity.ts
        cliente.entity.ts
    catalogos/
      entities/
        especie-catalogo.entity.ts
        raza-catalogo.entity.ts
        color-catalogo.entity.ts
        vacuna-catalogo.entity.ts
        antiparasitario-catalogo.entity.ts
    pacientes/
      entities/
        paciente.entity.ts
        paciente-tutor.entity.ts
        paciente-condicion.entity.ts
    citas/
      entities/
        cita.entity.ts
        cola-atencion.entity.ts
    atenciones/
      entities/
        atencion.entity.ts
        atencion-motivo-consulta.entity.ts
        atencion-anamnesis.entity.ts
        atencion-examen-clinico.entity.ts
        atencion-datos-medioambientales.entity.ts
        atencion-impresion-clinica.entity.ts
        atencion-plan.entity.ts
        tratamiento.entity.ts
        tratamiento-item.entity.ts
        vacunacion-evento.entity.ts
        desparasitacion-evento.entity.ts
        cirugia.entity.ts
        procedimiento.entity.ts
    media/
      entities/
        archivo-media.entity.ts
```

---

## Verification Plan

### Automated Tests
```bash
# Build the project to verify all entities compile
npm run build

# Start the app to verify TypeORM loads entities without errors
npm run start
```
