const fs = require("fs");
const mysql = require("mysql2/promise");

// ⚙️ Configuración de conexión
const connectionConfig = {
  host: "localhost",      // o tu host de MariaDB
  user: "root",           // cambia por tu usuario
  password: "1234", // cambia por tu contraseña
  database: "hotelsrec"  // cambia si tu base se llama distinto
};

async function importHotels() {
  try {
    // 📂 Leer el archivo JSON
    const data = fs.readFileSync("./data/hotels.json", "utf8");
    const hotels = JSON.parse(data);

    // 🔌 Conectarse a la base de datos
    const connection = await mysql.createConnection(connectionConfig);
    console.log("✅ Conectado a MariaDB.");

    // 🏨 Insertar cada hotel
    // console.log(hotels.features)
    // console.log(hotels)

    const allNames = hotels.features.map(f => f.properties.Name);
    const uniqueNames = new Set(allNames);
    console.log("Total en JSON:", allNames.length);
    console.log("Únicos por nombre:", uniqueNames.size);


    for (const feature of hotels.features) {
    //   console.log(feature.properties);
      const props = feature.properties;
      const [longitude, latitude] = feature.geometry.coordinates;

      const query = `
        INSERT INTO hotels 
        (name, address, phoneNumber, capacity, diningRoomCapacity, city, community, stars, averagePrice, longitude, latitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          address = VALUES(address),
          phoneNumber = VALUES(phoneNumber),
          capacity = VALUES(capacity),
          diningRoomCapacity = VALUES(diningRoomCapacity),
          city = VALUES(city),
          community = VALUES(community),
          stars = VALUES(stars),
          averagePrice = VALUES(averagePrice),
          longitude = VALUES(longitude),
          latitude = VALUES(latitude);
      `;

      const values = [
        props.Name,
        props.Address,
        props.PhoneNumber,
        props.Capacity,
        props.DiningRoomCapacity,
        props.City,
        props.Community,
        props.Stars,
        props.AveragePrice,
        longitude,
        latitude
      ];

    //   console.log(values);

      await connection.execute(query, values);
    }

    console.log("🎉 Hoteles importados correctamente.");
    await connection.end();
  } catch (err) {
    console.error("❌ Error importando hoteles:", err);
  }
}

importHotels();
