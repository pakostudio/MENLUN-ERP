const endpoint = process.env.APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID || "menlun-control-360";
const databaseId = process.env.APPWRITE_DATABASE_ID || "menlun_control_360";
const apiKey = process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.error("Falta APPWRITE_API_KEY. Crea una API key en Appwrite con permisos TablesDB y vuelve a ejecutar.");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey,
  "X-Appwrite-Response-Format": "1.9.5"
};

const userIds = {
  "pako@menlun.com": "pako",
  "carmen@menlun.com": "carmen",
  "direccion@menlun.com": "direccion",
  "produccion@menlun.com": "produccion",
  "calidad@menlun.com": "calidad",
  "compras@menlun.com": "compras",
  "almacen@menlun.com": "almacen",
  "logistica@menlun.com": "logistica",
  "mantenimiento@menlun.com": "mantenimiento",
  "ventas@menlun.com": "ventas",
  "rh@menlun.com": "rh",
  "contabilidad@menlun.com": "contabilidad",
  "sistemas@menlun.com": "sistemas"
};

const areaUserIds = {
  "Producción": "produccion",
  "Calidad": "calidad",
  "Compras": "compras",
  "Almacén": "almacen",
  "Logística": "logistica",
  "Mantenimiento": "mantenimiento",
  "Ventas": "ventas",
  "Recursos Humanos": "rh",
  "Contabilidad": "contabilidad",
  "Sistemas": "sistemas"
};

const adminUserIds = ["pako", "carmen"];
const executiveUserIds = ["direccion"];

const tablePermissions = [
  'read("users")',
  'create("users")'
];

const tables = [
  {
    id: "gerencias",
    name: "Gerencias",
    columns: [
      string("gerencia", 80, true),
      string("gerente", 120, true),
      email("email", true),
      string("pin", 12, true),
      string("rol", 100, true),
      string("frecuencia", 30, true),
      string("estatus", 30, true),
      datetime("ultimoReporte", false),
      float("presupuesto", false),
      float("gastoActual", false)
    ],
    rows: [
      row("produccion", { gerencia: "Producción", gerente: "Luis Ortega", email: "produccion@menlun.com", pin: "2401", rol: "Gerente de Producción", frecuencia: "Semanal", estatus: "Activo", ultimoReporte: "2026-06-03T12:00:00.000Z", presupuesto: 950000, gastoActual: 124000 }),
      row("calidad", { gerencia: "Calidad", gerente: "Mariana Ruiz", email: "calidad@menlun.com", pin: "2402", rol: "Gerente de Calidad", frecuencia: "Semanal", estatus: "Activo", ultimoReporte: "2026-06-03T12:00:00.000Z", presupuesto: 380000, gastoActual: 42000 }),
      row("compras", { gerencia: "Compras", gerente: "Rafael Torres", email: "compras@menlun.com", pin: "2403", rol: "Gerente de Compras", frecuencia: "Quincenal", estatus: "Activo", ultimoReporte: "2026-05-31T12:00:00.000Z", presupuesto: 720000, gastoActual: 108000 }),
      row("almacen", { gerencia: "Almacén", gerente: "Sofia Campos", email: "almacen@menlun.com", pin: "2404", rol: "Gerente de Almacén", frecuencia: "Semanal", estatus: "Activo", ultimoReporte: "2026-06-02T12:00:00.000Z", presupuesto: 410000, gastoActual: 51000 }),
      row("logistica", { gerencia: "Logística", gerente: "Jorge Vidal", email: "logistica@menlun.com", pin: "2405", rol: "Gerente de Logística", frecuencia: "Semanal", estatus: "Activo", ultimoReporte: "2026-06-02T12:00:00.000Z", presupuesto: 640000, gastoActual: 87000 }),
      row("mantenimiento", { gerencia: "Mantenimiento", gerente: "Elena Ponce", email: "mantenimiento@menlun.com", pin: "2406", rol: "Gerente de Mantenimiento", frecuencia: "Quincenal", estatus: "Activo", ultimoReporte: "2026-06-01T12:00:00.000Z", presupuesto: 560000, gastoActual: 69000 }),
      row("ventas", { gerencia: "Ventas", gerente: "Pablo Ibarra", email: "ventas@menlun.com", pin: "2407", rol: "Gerente Comercial", frecuencia: "Mensual", estatus: "Activo", ultimoReporte: "2026-05-30T12:00:00.000Z", presupuesto: 820000, gastoActual: 96000 }),
      row("recursos_humanos", { gerencia: "Recursos Humanos", gerente: "Claudia Rios", email: "rh@menlun.com", pin: "2408", rol: "Gerente de Recursos Humanos", frecuencia: "Mensual", estatus: "Activo", ultimoReporte: "2026-05-29T12:00:00.000Z", presupuesto: 330000, gastoActual: 31000 }),
      row("contabilidad", { gerencia: "Contabilidad", gerente: "Hector Silva", email: "contabilidad@menlun.com", pin: "2409", rol: "Gerente de Contabilidad", frecuencia: "Quincenal", estatus: "Activo", ultimoReporte: "2026-05-31T12:00:00.000Z", presupuesto: 450000, gastoActual: 47000 }),
      row("sistemas", { gerencia: "Sistemas", gerente: "Natalia Flores", email: "sistemas@menlun.com", pin: "2410", rol: "Gerente de Sistemas", frecuencia: "Mensual", estatus: "Activo", ultimoReporte: "2026-05-30T12:00:00.000Z", presupuesto: 690000, gastoActual: 78000 })
    ]
  },
  {
    id: "usuarios",
    name: "Usuarios",
    columns: [
      string("nombre", 120, true),
      email("email", true),
      string("rol", 100, true),
      string("gerencia", 80, false),
      string("pin", 12, false),
      string("estatus", 30, true)
    ],
    rows: [
      row("pako", { nombre: "Pako", email: "pako@menlun.com", rol: "Administrador General", gerencia: "Todas", pin: "", estatus: "Activo" }),
      row("carmen", { nombre: "Carmen", email: "carmen@menlun.com", rol: "Acceso Total Operativo", gerencia: "Todas", pin: "", estatus: "Activo" }),
      row("direccion", { nombre: "Dirección General", email: "direccion@menlun.com", rol: "Vista Ejecutiva", gerencia: "Dirección", pin: "", estatus: "Activo" })
    ]
  },
  {
    id: "reportes",
    name: "Reportes",
    columns: [
      datetime("fecha", true),
      string("gerencia", 80, true),
      string("responsable", 120, true),
      string("frecuencia", 30, true),
      string("tipo", 50, true),
      float("monto", false),
      string("prioridad", 20, true),
      string("estatus", 40, true),
      text("descripcion", false),
      string("evidencia", 180, false),
      text("comentarios", false),
      datetime("vencimiento", false)
    ],
    rows: [
      row("rep-001", { fecha: "2026-06-03T10:00:00.000Z", gerencia: "Producción", responsable: "Luis Ortega", frecuencia: "Semanal", tipo: "gasto", monto: 42000, prioridad: "alta", estatus: "pendiente", descripcion: "Refacciones para línea de empaque.", evidencia: "OC-1001.pdf", comentarios: "Validar presupuesto.", vencimiento: "2026-06-06T18:00:00.000Z" }),
      row("rep-002", { fecha: "2026-06-02T09:30:00.000Z", gerencia: "Calidad", responsable: "Mariana Ruiz", frecuencia: "Semanal", tipo: "incidencia", monto: 0, prioridad: "alta", estatus: "falta evidencia", descripcion: "Desviación en lote de inspección.", evidencia: "", comentarios: "Requiere foto y dictamen.", vencimiento: "2026-06-04T18:00:00.000Z" }),
      row("rep-003", { fecha: "2026-06-01T11:00:00.000Z", gerencia: "Compras", responsable: "Rafael Torres", frecuencia: "Quincenal", tipo: "solicitud", monto: 86000, prioridad: "media", estatus: "en revisión", descripcion: "Autorización de proveedor alterno.", evidencia: "cotizaciones.zip", comentarios: "Comparativo enviado.", vencimiento: "2026-06-08T18:00:00.000Z" }),
      row("rep-004", { fecha: "2026-05-31T16:00:00.000Z", gerencia: "Logística", responsable: "Jorge Vidal", frecuencia: "Semanal", tipo: "ahorro", monto: 24000, prioridad: "baja", estatus: "aprobado", descripcion: "Optimización de rutas.", evidencia: "rutas.xlsx", comentarios: "Ahorro validado.", vencimiento: "2026-06-10T18:00:00.000Z" }),
      row("rep-005", { fecha: "2026-06-02T15:00:00.000Z", gerencia: "Almacén", responsable: "Sofia Campos", frecuencia: "Semanal", tipo: "reporte operativo", monto: 32800, prioridad: "media", estatus: "aprobado", descripcion: "Ajuste de inventario por diferencia física.", evidencia: "conteo-ciclico.xlsx", comentarios: "Autorizado por operaciones.", vencimiento: "2026-06-03T18:00:00.000Z" }),
      row("rep-006", { fecha: "2026-06-02T12:00:00.000Z", gerencia: "Logística", responsable: "Jorge Vidal", frecuencia: "Semanal", tipo: "gasto", monto: 142300, prioridad: "alta", estatus: "pendiente", descripcion: "Rutas extraordinarias zona norte.", evidencia: "rutas-junio.pdf", comentarios: "Fuera de presupuesto.", vencimiento: "2026-06-04T18:00:00.000Z" }),
      row("rep-007", { fecha: "2026-06-01T09:00:00.000Z", gerencia: "Mantenimiento", responsable: "Elena Ponce", frecuencia: "Quincenal", tipo: "incidencia", monto: 58900, prioridad: "alta", estatus: "en ejecucion", descripcion: "Falla crítica en compresor.", evidencia: "orden-servicio.pdf", comentarios: "Atención en proceso.", vencimiento: "2026-06-02T18:00:00.000Z" }),
      row("rep-008", { fecha: "2026-06-01T13:00:00.000Z", gerencia: "Ventas", responsable: "Pablo Ibarra", frecuencia: "Mensual", tipo: "solicitud", monto: 94000, prioridad: "media", estatus: "pendiente", descripcion: "Descuento especial cliente clave.", evidencia: "caso-comercial.pdf", comentarios: "Requiere autorización.", vencimiento: "2026-06-08T18:00:00.000Z" }),
      row("rep-009", { fecha: "2026-05-31T10:00:00.000Z", gerencia: "Recursos Humanos", responsable: "Claudia Rios", frecuencia: "Mensual", tipo: "mejora", monto: 0, prioridad: "baja", estatus: "cerrado", descripcion: "Actualización de matriz de capacitación.", evidencia: "matriz-rh.xlsx", comentarios: "Completado.", vencimiento: "2026-06-01T18:00:00.000Z" }),
      row("rep-010", { fecha: "2026-05-31T17:00:00.000Z", gerencia: "Contabilidad", responsable: "Hector Silva", frecuencia: "Quincenal", tipo: "reporte operativo", monto: 0, prioridad: "alta", estatus: "pendiente", descripcion: "Reporte de cierre parcial.", evidencia: "", comentarios: "Reporte vencido.", vencimiento: "2026-06-01T18:00:00.000Z" }),
      row("rep-011", { fecha: "2026-05-30T14:00:00.000Z", gerencia: "Sistemas", responsable: "Natalia Flores", frecuencia: "Mensual", tipo: "gasto", monto: 116200, prioridad: "media", estatus: "rechazado", descripcion: "Licenciamiento no presupuestado.", evidencia: "cotizacion-saas.pdf", comentarios: "Replantear alcance.", vencimiento: "2026-06-06T18:00:00.000Z" }),
      row("rep-012", { fecha: "2026-06-04T08:00:00.000Z", gerencia: "Producción", responsable: "Luis Ortega", frecuencia: "Semanal", tipo: "ahorro", monto: 42000, prioridad: "media", estatus: "aprobado", descripcion: "Ahorro por cambio de turno.", evidencia: "ahorro-turno.xlsx", comentarios: "Impacto validado.", vencimiento: "2026-06-05T18:00:00.000Z" })
    ]
  },
  {
    id: "autorizaciones",
    name: "Autorizaciones",
    columns: [
      string("reporteId", 36, true),
      datetime("fecha", true),
      string("gerencia", 80, true),
      string("responsable", 120, true),
      string("tipo", 50, true),
      float("monto", false),
      string("prioridad", 20, true),
      string("estatus", 40, true),
      string("accion", 40, true)
    ],
    rows: [
      row("aut-001", { reporteId: "rep-001", fecha: "2026-06-03T10:00:00.000Z", gerencia: "Producción", responsable: "Luis Ortega", tipo: "gasto", monto: 42000, prioridad: "alta", estatus: "pendiente", accion: "Revisar" }),
      row("aut-002", { reporteId: "rep-003", fecha: "2026-06-01T11:00:00.000Z", gerencia: "Compras", responsable: "Rafael Torres", tipo: "solicitud", monto: 86000, prioridad: "media", estatus: "en revisión", accion: "Revisar" })
    ]
  },
  {
    id: "tareas",
    name: "Tareas",
    columns: [
      string("titulo", 160, true),
      string("gerencia", 80, true),
      string("responsable", 120, true),
      string("prioridad", 20, true),
      string("estatus", 40, true),
      datetime("vencimiento", true),
      string("reporteId", 36, false)
    ],
    rows: [
      row("task-001", { titulo: "Cargar evidencia de desviación", gerencia: "Calidad", responsable: "Mariana Ruiz", prioridad: "alta", estatus: "vencida", vencimiento: "2026-06-04T18:00:00.000Z", reporteId: "rep-002" }),
      row("task-002", { titulo: "Validar gasto de refacciones", gerencia: "Producción", responsable: "Luis Ortega", prioridad: "alta", estatus: "pendiente", vencimiento: "2026-06-06T18:00:00.000Z", reporteId: "rep-001" })
    ]
  },
  {
    id: "evidencias",
    name: "Evidencias",
    columns: [
      string("reporteId", 36, true),
      string("nombreArchivo", 180, true),
      string("tipo", 60, false),
      string("fileId", 80, false),
      string("estatus", 40, true),
      datetime("fechaCarga", false)
    ],
    rows: [
      row("evi-001", { reporteId: "rep-001", nombreArchivo: "OC-1001.pdf", tipo: "PDF", fileId: "oc-1001", estatus: "cargada", fechaCarga: "2026-06-03T10:20:00.000Z" }),
      row("evi-002", { reporteId: "rep-002", nombreArchivo: "pendiente", tipo: "imagen", fileId: "", estatus: "faltante", fechaCarga: "2026-06-04T18:00:00.000Z" })
    ]
  },
  {
    id: "bitacora",
    name: "Bitacora",
    columns: [
      datetime("fecha", true),
      string("usuario", 120, true),
      string("rol", 120, true),
      string("accion", 80, true),
      string("reporteId", 80, false),
      string("gerencia", 80, false),
      text("detalle", false)
    ],
    rows: [
      row("log-inicial", { fecha: "2026-06-05T00:00:00.000Z", usuario: "Sistema", rol: "Sistema", accion: "inicio", reporteId: "", gerencia: "Todas", detalle: "Bitácora inicial de MENLUN Control 360." })
    ]
  }
];

for (const table of tables) {
  await ensureTable(table);
  for (const column of table.columns) {
    await ensureColumn(table.id, column);
  }
  await waitForColumns(table.id, table.columns.map((column) => column.key));
  for (const seedRow of table.rows || []) {
    await ensureRow(table.id, seedRow);
  }
  await hardenRows(table.id);
}

console.log("Appwrite listo: tablas, columnas y datos base creados.");

function string(key, size, required = false) {
  return { type: "string", key, size, required };
}

function email(key, required = false) {
  return { type: "email", key, required };
}

function text(key, required = false) {
  return { type: "text", key, required };
}

function datetime(key, required = false) {
  return { type: "datetime", key, required };
}

function float(key, required = false) {
  return { type: "float", key, required };
}

function row(id, data) {
  return { id, data };
}

async function ensureTable(table) {
  const existing = await request("GET", `/tablesdb/${databaseId}/tables/${table.id}`, null, [404]);
  if (existing.status === 200) {
    await request("PUT", `/tablesdb/${databaseId}/tables/${table.id}`, {
      name: table.name,
      permissions: tablePermissions,
      rowSecurity: true,
      enabled: true,
      purge: true
    });
    console.log(`Tabla existente: ${table.id}`);
    return;
  }

  await request("POST", `/tablesdb/${databaseId}/tables`, {
    tableId: table.id,
    name: table.name,
    permissions: tablePermissions,
    rowSecurity: true,
    enabled: true,
    columns: [],
    indexes: []
  });
  console.log(`Tabla creada: ${table.id}`);
}

async function ensureColumn(tableId, column) {
  const existing = await request("GET", `/tablesdb/${databaseId}/tables/${tableId}/columns/${column.key}`, null, [404]);
  if (existing.status === 200) {
    console.log(`  Columna existente: ${tableId}.${column.key}`);
    return;
  }

  const body = { key: column.key, required: column.required, array: false };
  if (column.type === "string") body.size = column.size || 255;

  await request("POST", `/tablesdb/${databaseId}/tables/${tableId}/columns/${column.type}`, body);
  console.log(`  Columna creada: ${tableId}.${column.key}`);
}

async function waitForColumns(tableId, keys) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const ready = await Promise.all(keys.map(async (key) => {
      const response = await request("GET", `/tablesdb/${databaseId}/tables/${tableId}/columns/${key}`, null, [404, 409]);
      return response.status === 200 && (!response.json.status || response.json.status === "available");
    }));
    if (ready.every(Boolean)) return;
    await sleep(1500);
  }
  console.warn(`  Algunas columnas de ${tableId} siguen procesándose; se intentará cargar datos.`);
}

async function ensureRow(tableId, seedRow) {
  const permissions = permissionsForRow(tableId, seedRow.data, seedRow.id);
  const existing = await request("GET", `/tablesdb/${databaseId}/tables/${tableId}/rows/${seedRow.id}`, null, [404]);
  if (existing.status === 200) {
    await request("PATCH", `/tablesdb/${databaseId}/tables/${tableId}/rows/${seedRow.id}`, {
      data: seedRow.data,
      permissions
    });
    console.log(`  Fila actualizada: ${tableId}.${seedRow.id}`);
    return;
  }

  await request("POST", `/tablesdb/${databaseId}/tables/${tableId}/rows`, {
    rowId: seedRow.id,
    data: seedRow.data,
    permissions
  });
  console.log(`  Fila creada: ${tableId}.${seedRow.id}`);
}

async function hardenRows(tableId) {
  const response = await request("GET", `/tablesdb/${databaseId}/tables/${tableId}/rows`);
  const rows = response.json.rows || [];

  for (const existingRow of rows) {
    await request("PATCH", `/tablesdb/${databaseId}/tables/${tableId}/rows/${existingRow.$id}`, {
      permissions: permissionsForRow(tableId, existingRow, existingRow.$id)
    });
  }

  console.log(`  Permisos cerrados: ${tableId} (${rows.length} filas)`);
}

function permissionsForRow(tableId, data, rowId = "") {
  if (tableId === "usuarios") {
    const ownerId = userIds[String(data.email || "").toLowerCase()] || rowId;
    return uniquePermissions([
      ...readForUsers([...adminUserIds, ownerId]),
      ...updateForUsers(adminUserIds),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  if (tableId === "gerencias") {
    const areaUserId = areaUserIds[data.gerencia];
    return uniquePermissions([
      ...readForUsers([...adminUserIds, ...executiveUserIds, areaUserId]),
      ...updateForUsers(adminUserIds),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  if (["reportes", "autorizaciones", "tareas", "evidencias"].includes(tableId)) {
    const areaUserId = areaUserIds[data.gerencia] || areaUserIds[areaFromReport(data.reporteId)];
    return uniquePermissions([
      ...readForUsers([...adminUserIds, ...executiveUserIds, areaUserId]),
      ...updateForUsers([...adminUserIds, areaUserId]),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  if (tableId === "bitacora") {
    return uniquePermissions([
      ...readForUsers(adminUserIds),
      ...updateForUsers(adminUserIds),
      ...deleteForUsers(adminUserIds),
    ]);
  }

  return uniquePermissions([
    ...readForUsers(adminUserIds),
    ...updateForUsers(adminUserIds),
    ...deleteForUsers(adminUserIds),
  ]);
}

function areaFromReport(reportId) {
  const reportTable = tables.find((table) => table.id === "reportes");
  const report = reportTable?.rows.find((item) => item.id === reportId);
  return report?.data.gerencia || "";
}

function readForUsers(ids) {
  return ids.filter(Boolean).map((id) => `read("user:${id}")`);
}

function updateForUsers(ids) {
  return ids.filter(Boolean).map((id) => `update("user:${id}")`);
}

function deleteForUsers(ids) {
  return ids.filter(Boolean).map((id) => `delete("user:${id}")`);
}

function uniquePermissions(permissions) {
  return Array.from(new Set(permissions));
}

async function request(method, path, body, expectedSoftErrors = []) {
  const response = await fetch(`${endpoint}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (!response.ok && !expectedSoftErrors.includes(response.status)) {
    throw new Error(`${method} ${path} -> ${response.status}: ${text}`);
  }

  return { status: response.status, json };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
