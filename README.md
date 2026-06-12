# MENLUN Control 360

MENLUN Control 360 es una app web estatica para operar y supervisar reportes internos por gerencia. Esta construido con HTML, CSS y JavaScript puro, conectado a Appwrite Cloud como backend operativo.

El sistema usa identidad visual PMPS: Arial, azul marino `#0B2A4A`, cyan `#00A7D8`, blanco `#FFFFFF` y gris claro `#F4F7FA`.

## Usuarios iniciales

| Usuario | Email | Rol | Acceso |
| --- | --- | --- | --- |
| Pako | `pako@menlun.com` | Administrador General | Acceso total |
| Carmen | `carmen@menlun.com` | Acceso Total Operativo | Acceso total |
| Direccion General | `direccion@menlun.com` | Vista Ejecutiva | Dashboard, calendario y reportes |
| Produccion | `produccion@menlun.com` | Gerente de Produccion | Solo Produccion |

Las contrasenas deben administrarse desde Appwrite Auth. No se publican contrasenas en el frontend ni en este documento.

## Roles

- **Administrador General:** ve todos los modulos, gerencias, reportes, autorizaciones y dashboards.
- **Acceso Total Operativo:** ve todos los modulos operativos y administrativos.
- **Direccion General:** consulta informacion ejecutiva y reportes, sin edicion.
- **Gerente de area:** ve solo su gerencia, sus reportes, sus tareas, captura, kanban y calendario.

## Modulos incluidos

- Login por email y contrasena real de Appwrite Auth.
- Cierre de sesion conectado a Appwrite Auth.
- Dashboard ejecutivo.
- Panel Carmen.
- Panel Gerencias.
- Bitacora de cambios.
- Filtros avanzados de reportes por fecha, gerencia, estatus, prioridad y tipo.
- Exportacion CSV compatible con Excel para reportes y bitacora.
- Vista PDF/imprimir para Dashboard ejecutivo, reportes y bitacora.
- Captura de reportes.
- Kanban por estatus.
- Calendario mensual.
- Modulos por gerencia:
  - Produccion
  - Calidad
  - Compras
  - Almacen
  - Logistica
  - Mantenimiento
  - Ventas
  - Recursos Humanos
  - Contabilidad
  - Sistemas

## Flujo de operacion

1. La app intenta conectar con Appwrite y cargar gerencias/reportes.
2. Si el servicio responde, el indicador superior muestra `Sistema en línea`.
3. El usuario inicia sesion con email y contrasena real. La sesion se valida contra Appwrite Auth.
4. El sistema muestra solo los modulos permitidos para su rol.
5. Pako y Carmen pueden revisar el dashboard ejecutivo, Panel Carmen, Gerencias, reportes, kanban y calendario.
6. Direccion General puede consultar dashboard ejecutivo, reportes y calendario, sin edicion.
7. Cada gerente puede capturar reportes y revisar informacion de su propia area.
8. Los reportes capturados se guardan en Appwrite y alimentan tarjetas, tablas, bandejas de autorizacion, kanban y vistas por gerencia.
9. Pako y Carmen pueden editar reportes, aprobar, rechazar, cerrar o marcar falta de evidencia.
10. Cada cambio relevante queda registrado en la tabla `bitacora` y puede consultarse desde el modulo Bitacora.
11. Los reportes y bitacora pueden filtrarse y exportarse a CSV o enviarse a PDF/imprimir desde la interfaz.
12. El usuario puede cerrar sesion desde el header superior.

## Backend Appwrite

Proyecto Appwrite:

- Project ID: `menlun-control-360`
- Project name: `MENLUN Control 360`
- Database ID: `menlun_control_360`
- Endpoint: `https://nyc.cloud.appwrite.io/v1`
- Configuracion frontend: `appwriteConfig.js`

La fuente unica de configuracion del frontend es `appwriteConfig.js`.

Tablas creadas:

- `gerencias`
- `usuarios`
- `reportes`
- `autorizaciones`
- `tareas`
- `evidencias`
- `bitacora`
- `jefaturas`
- `gastos`
- `viaticos`
- `mantenimientos`

Storage creado:

- Bucket `evidencias`
- Tipos permitidos: PDF, imagenes, Excel, Word y ZIP
- Tamano maximo por archivo: 10 MB

Hostnames registrados como Web Platform:

- `127.0.0.1`
- `localhost`
- `pakostudio.github.io`

El archivo [scripts/setup-appwrite.mjs](scripts/setup-appwrite.mjs) recrea/actualiza tablas, columnas, permisos y datos iniciales. Requiere una API key en variable de entorno:

```bash
APPWRITE_API_KEY="TU_API_KEY" node scripts/setup-appwrite.mjs
```

El archivo [scripts/setup-appwrite-auth.mjs](scripts/setup-appwrite-auth.mjs) crea/actualiza los usuarios reales de Appwrite Auth. Requiere una contrasena inicial segura mediante variable de entorno:

```bash
APPWRITE_API_KEY="TU_API_KEY" APPWRITE_INITIAL_PASSWORD="CONTRASENA_SEGURA" node scripts/setup-appwrite-auth.mjs
```

Despues de crear usuarios, cambia las contrasenas temporales desde Appwrite Auth antes de entregar accesos finales.

El archivo [scripts/setup-appwrite-storage.mjs](scripts/setup-appwrite-storage.mjs) crea/actualiza el bucket real de evidencias.

## Consideraciones operativas

- El frontend lee/escribe en Appwrite y valida sesion con Appwrite Auth.
- Si Appwrite no responde o el proyecto esta pausado, el sistema bloquea escrituras y muestra: `Proyecto Appwrite pausado o sin conexión. Restaurar proyecto desde Appwrite Console antes de continuar.`
- Las tablas tienen seguridad por fila activa en Appwrite.
- Las filas base quedan con permisos por usuario. Las filas creadas desde el frontend puro usan permisos de usuarios autenticados para permitir escritura sin exponer una API key; la visibilidad por rol se aplica desde la interfaz.
- Las acciones administrativas quedan limitadas a Pako/Carmen desde interfaz.
- La carga de evidencias ya usa Appwrite Storage; falta versionar evidencias y agregar previsualizacion avanzada.
- La bitacora registra cambios principales y ya cuenta con pantalla de consulta, filtros y exportacion.
- Los reportes cuentan con filtros y exportacion en Panel Carmen, Reportes, Kanban y modulos por gerencia.
- La app registra una actividad diaria por usuario autenticado para dejar evidencia de uso operativo sin saturar la bitacora.
- No se usa `localStorage` para datos operativos; la trazabilidad se registra en Appwrite.

### Rutina temporal para Appwrite Free

Appwrite Free puede pausar proyectos por inactividad. Para reducir el riesgo durante la fase de aprobacion del cliente, este repositorio incluye una rutina diaria en GitHub Actions:

- Archivo: `.github/workflows/appwrite-heartbeat.yml`
- Script: `scripts/appwrite-heartbeat.mjs`
- Frecuencia: diaria a las 14:00 UTC y ejecucion manual desde GitHub Actions.
- Accion: inserta un registro `heartbeat` en la tabla `bitacora`.

Para activarla en GitHub:

1. Ir al repositorio en GitHub.
2. Entrar a **Settings > Secrets and variables > Actions**.
3. Crear el Secret `APPWRITE_API_KEY` con una API key valida de Appwrite.
4. Entrar a **Actions > Appwrite heartbeat**.
5. Ejecutar **Run workflow** una vez para validar que registre correctamente.

Esta rutina ayuda a monitorear y generar actividad tecnica, pero no sustituye un plan pagado si el cliente requiere disponibilidad garantizada. Antes de una demo importante, revisar manualmente que el proyecto siga activo en Appwrite Console.

## Pendientes futuros

- Migrar escrituras sensibles a Appwrite Functions o servidor propio para aplicar permisos finos por rol desde backend.
- Migrar de permisos por usuario a Appwrite Teams si la plantilla de usuarios crece de forma masiva.
- Agregar versionado de evidencias y previsualizacion avanzada.
- Agregar permisos finos por accion.
- Crear version movil optimizada.
- Agregar pruebas automatizadas formales.

## Despliegue en GitHub Pages

1. Crear un repositorio en GitHub.
2. Subir estos archivos al repositorio:
   - `index.html`
   - `styles.css`
   - `appwriteConfig.js`
   - `app.js`
   - `assets/pmps-logo.png`
   - `assets/pmps-icon.png`
   - `README.md`
   - `.github/workflows/appwrite-heartbeat.yml`
   - `.gitignore`
   - `scripts/appwrite-heartbeat.mjs`
   - `scripts/setup-appwrite.mjs` si se desea conservar el instalador tecnico del backend
   - `scripts/setup-appwrite-auth.mjs` si se desea conservar el instalador tecnico de usuarios
   - `scripts/setup-appwrite-storage.mjs` si se desea conservar el instalador tecnico de evidencias
3. Entrar a **Settings** del repositorio.
4. Ir a **Pages**.
5. En **Build and deployment**, seleccionar:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Guardar la configuracion.
7. Esperar a que GitHub genere la URL publica.

La app puede ejecutarse directamente como sitio estatico porque no requiere compilacion. Para que Appwrite responda desde GitHub Pages, el hostname `pakostudio.github.io` debe permanecer registrado como Web Platform.
