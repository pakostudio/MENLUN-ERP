const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1",
  projectId: process.env.APPWRITE_PROJECT_ID || "menlun-control-360",
  databaseId: process.env.APPWRITE_DATABASE_ID || "menlun_control_360",
  tableId: process.env.APPWRITE_HEARTBEAT_TABLE_ID || "bitacora",
  apiKey: process.env.APPWRITE_API_KEY,
};

const runMeta = {
  repository: process.env.GITHUB_REPOSITORY || "local",
  runId: process.env.GITHUB_RUN_ID || "local",
  attempt: process.env.GITHUB_RUN_ATTEMPT || "1",
};

const heartbeatPermissions = [
  'read("user:pako")',
  'update("user:pako")',
  'delete("user:pako")',
];

function requireEnv(value, name) {
  if (!value) throw new Error(`Falta configurar ${name}.`);
}

async function appwriteRequest(path, options = {}) {
  const response = await fetch(`${config.endpoint}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": config.projectId,
      "X-Appwrite-Key": config.apiKey,
      "X-Appwrite-Response-Format": "1.9.5",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = new Error(data.message || `Error Appwrite ${response.status}`);
    error.status = response.status;
    error.type = data.type || "";
    throw error;
  }

  return data;
}

function heartbeatData(now, mode) {
  return {
    fecha: now.toISOString(),
    usuario: "Sistema",
    rol: "Rutina operativa",
    accion: mode,
    reporteId: runMeta.runId,
    gerencia: "Todas",
    detalle: `Control de salud MENLUN Control 360. Repo=${runMeta.repository}. Intento=${runMeta.attempt}.`,
  };
}

async function assertProjectActive() {
  const project = await appwriteRequest("/project");
  if (project.status && project.status !== "active") {
    throw new Error(`Proyecto Appwrite no activo. Estado actual: ${project.status}.`);
  }
  console.log(`Proyecto activo: ${project.name || config.projectId}`);
}

async function upsertLatest(now) {
  const rowId = "heartbeat-latest";
  const body = {
    data: heartbeatData(now, "heartbeat-latest"),
    permissions: heartbeatPermissions,
  };

  try {
    await appwriteRequest(`/tablesdb/${config.databaseId}/tables/${config.tableId}/rows/${rowId}`, {
      method: "PATCH",
      body,
    });
    console.log("Heartbeat latest actualizado.");
  } catch (error) {
    if (Number(error.status) !== 404) throw error;
    await appwriteRequest(`/tablesdb/${config.databaseId}/tables/${config.tableId}/rows`, {
      method: "POST",
      body: { rowId, ...body },
    });
    console.log("Heartbeat latest creado.");
  }
}

async function createHistory(now) {
  const rowId = `heartbeat-${Date.now().toString(36)}`;
  await appwriteRequest(`/tablesdb/${config.databaseId}/tables/${config.tableId}/rows`, {
    method: "POST",
    body: {
      rowId,
      permissions: heartbeatPermissions,
      data: heartbeatData(now, "heartbeat"),
    },
  });
  console.log(`Heartbeat histórico registrado: ${rowId}`);
}

async function main() {
  requireEnv(config.apiKey, "APPWRITE_API_KEY");
  const now = new Date();
  await assertProjectActive();
  await upsertLatest(now);
  await createHistory(now);
}

main().catch((error) => {
  if (error.type === "project_paused" || String(error.message).toLowerCase().includes("paused")) {
    console.error("El proyecto Appwrite está pausado. El heartbeat no puede reactivar un proyecto ya pausado desde Free.");
  } else {
    console.error(error.message);
  }
  process.exit(1);
});
