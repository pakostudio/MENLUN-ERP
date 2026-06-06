const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1",
  projectId: process.env.APPWRITE_PROJECT_ID || "menlun-control-360",
  databaseId: process.env.APPWRITE_DATABASE_ID || "menlun_control_360",
  tableId: process.env.APPWRITE_HEARTBEAT_TABLE_ID || "bitacora",
  apiKey: process.env.APPWRITE_API_KEY,
};

const adminPermissions = [
  'read("user:pako")',
  'read("user:carmen")',
  'update("user:pako")',
  'update("user:carmen")',
  'delete("user:pako")',
  'delete("user:carmen")',
];

function requireEnv(value, name) {
  if (!value) {
    throw new Error(`Falta configurar ${name}.`);
  }
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
    throw new Error(data.message || `Error Appwrite ${response.status}`);
  }

  return data;
}

async function main() {
  requireEnv(config.apiKey, "APPWRITE_API_KEY");

  const now = new Date();
  const rowId = `heartbeat-${now.toISOString().slice(0, 10)}`;

  await appwriteRequest(`/tablesdb/${config.databaseId}/tables/${config.tableId}/rows`, {
    method: "POST",
    body: {
      rowId,
      permissions: adminPermissions,
      data: {
        fecha: now.toISOString(),
        usuario: "Sistema",
        rol: "Rutina operativa",
        accion: "heartbeat",
        reporteId: "",
        gerencia: "Todas",
        detalle: "Rutina diaria de salud para MENLUN Control 360.",
      },
    },
  });

  console.log(`Heartbeat registrado: ${rowId}`);
}

main().catch((error) => {
  const alreadyExists = String(error.message || "").toLowerCase().includes("already exists");

  if (alreadyExists) {
    console.log("Heartbeat diario ya estaba registrado.");
    process.exit(0);
  }

  console.error(error.message);
  process.exit(1);
});
