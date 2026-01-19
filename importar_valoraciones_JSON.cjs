const fs = require("fs");
const mysql = require("mysql2/promise");

// ⚙️ Configuración de conexión
const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "1234",
  database: "hotelsrec"
};

async function importRatings() {
  try {
    // 📂 Leer archivo JSON
    const data = fs.readFileSync("./data/usersRatings.json", "utf8");
    const ratings = JSON.parse(data);

    // console.log(ratings)

    // 🔌 Conectar con la BD
    const connection = await mysql.createConnection(connectionConfig);
    console.log("✅ Conectado a MariaDB para importar valoraciones.");

    // 🔄 Query de inserción con UPDATE si la dupla userEmail–hotelName ya existe
    // Esto evita duplicados y respeta tu regla
    const query = `
      INSERT INTO usersRatings (rating, userEmail, hotelName, comment)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        rating = VALUES(rating),
        comment = VALUES(comment);
    `;

    // 🧩 Recorremos cada valoración del JSON
    for (const r of ratings.features) {
      const values = [
        r.rating,
        r.userEmail,   // alias en JSON
        r.hotelName,    // alias en JSON
        r.comment      // alias en JSON
      ];

      try {
        await connection.execute(query, values);
      } catch (err) {
        console.error("❌ Error con esta fila:", r);
        console.error(err);
      }
    }

    console.log("🎉 Valoraciones importadas correctamente.");
    await connection.end();
  } catch (err) {
    console.error("❌ Error importando valoraciones:", err);
  }
}

importRatings();
