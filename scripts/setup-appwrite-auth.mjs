const endpoint = process.env.APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID || "menlun-control-360";
const apiKey = process.env.APPWRITE_API_KEY;
const initialPassword = process.env.APPWRITE_INITIAL_PASSWORD;

if (!apiKey) {
  console.error("Falta APPWRITE_API_KEY.");
  process.exit(1);
}

if (!initialPassword || initialPassword.length < 8) {
  console.error("Falta APPWRITE_INITIAL_PASSWORD de minimo 8 caracteres.");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Key": apiKey,
  "X-Appwrite-Response-Format": "1.9.5",
};

const users = [
  ["pako", "Pako", "pako@menlun.com"],
  ["carmen", "Carmen", "carmen@menlun.com"],
  ["direccion", "Direccion General", "direccion@menlun.com"],
  ["produccion", "Luis Ortega", "produccion@menlun.com"],
  ["calidad", "Mariana Ruiz", "calidad@menlun.com"],
  ["compras", "Rafael Torres", "compras@menlun.com"],
  ["almacen", "Sofia Campos", "almacen@menlun.com"],
  ["logistica", "Jorge Vidal", "logistica@menlun.com"],
  ["mantenimiento", "Elena Ponce", "mantenimiento@menlun.com"],
  ["ventas", "Pablo Ibarra", "ventas@menlun.com"],
  ["rh", "Claudia Rios", "rh@menlun.com"],
  ["contabilidad", "Hector Silva", "contabilidad@menlun.com"],
  ["sistemas", "Natalia Flores", "sistemas@menlun.com"],
];

for (const [userId, name, email] of users) {
  await ensureUser({ userId, name, email, password: initialPassword });
}

console.log("Usuarios Auth de Appwrite listos.");

async function ensureUser(user) {
  const existing = await request("GET", `/users/${user.userId}`, null, [404]);

  if (existing.status === 200) {
    await request("PATCH", `/users/${user.userId}/name`, { name: user.name });
    await request("PATCH", `/users/${user.userId}/password`, { password: user.password });
    console.log(`Usuario actualizado: ${user.email}`);
    return;
  }

  await request("POST", "/users", user);
  console.log(`Usuario creado: ${user.email}`);
}

async function request(method, path, body, expectedSoftErrors = []) {
  const response = await fetch(`${endpoint}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (!response.ok && !expectedSoftErrors.includes(response.status)) {
    throw new Error(`${method} ${path} -> ${response.status}: ${text}`);
  }

  return { status: response.status, json };
}
