import mysql from "mysql2/promise";

let pool;

export async function initDB() {
  if (!pool) {
    pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "1234",
      database: "hotelsrec",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("✅ Conectado a MariaDB");
  }
  return pool;
}

export function getDB() {
  if (!pool) {
    throw new Error("❌ La base de datos no está inicializada. Llama a initDB() primero.");
  }
  return pool;
}

