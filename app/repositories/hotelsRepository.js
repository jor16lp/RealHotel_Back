import { getDB } from "./connection.js";

const hotelsRepository = {
  getAll: async () => {
    const db = getDB();
    const [rows] = await db.query("SELECT * FROM hotels");
    return rows;
  },

  getById: async (id) => {
    const db = getDB();
    const [rows] = await db.query("SELECT * FROM hotels WHERE id = ?", [id]);
    return rows[0] || null;
  },

  getByName: async (name) => {
    const db = getDB();
    const [rows] = await db.query("SELECT * FROM hotels WHERE name = ?", [name]);
    return rows[0] || null;
  },

  getByNames: async (names) => {
    const db = getDB();
    if (!names || names.length === 0) return [];
    const placeholders = names.map(() => '?').join(',');
    const query = `SELECT * FROM hotels WHERE name IN (${placeholders})`;
    const [rows] = await db.query(query, names);
    return rows;
  },

  getByCity: async (city) => {
    const db = getDB();
    const [rows] = await db.query(
      "SELECT * FROM hotels WHERE city = ?",
      [city]
    );
    return rows;
  },

  getCities: async () => {
    const db = getDB();
    const [rows] = await db.query(
      "SELECT DISTINCT city FROM hotels"
    );
    return rows;
  },

  create: async (hotel) => {
    const db = getDB();
    const { name, address, phoneNumber, capacity, diningRoomCapacity, city, community, stars, averagePrice, longitude, latitude } = hotel;
    const [result] = await db.query(
      `INSERT INTO hotels 
        (name, address, phoneNumber, capacity, diningRoomCapacity, city, community, stars, averagePrice, longitude, latitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, address, phoneNumber, capacity, diningRoomCapacity, city, community, stars, averagePrice, longitude, latitude]
    );
    return { id: result.insertId, ...hotel };
  },

  update: async (id, hotel) => {
    const db = getDB();
    const { name, address, phoneNumber, capacity, diningRoomCapacity, city, community, stars, averagePrice, longitude, latitude } = hotel;
    await db.query(
      `UPDATE hotels SET 
        name = ?, 
        address = ?, 
        phoneNumber = ?, 
        capacity = ?, 
        diningRoomCapacity = ?, 
        city = ?, 
        community = ?, 
        stars = ?, 
        averagePrice = ?, 
        longitude = ?, 
        latitude = ? 
      WHERE id = ?`,
      [name, address, phoneNumber, capacity, diningRoomCapacity, city, community, stars, averagePrice, longitude, latitude, id]
    );
    return { id, ...hotel };
  },

  deleteById: async (id) => {
    const db = getDB();
    await db.query("DELETE FROM hotels WHERE id = ?", [id]);
    return { message: "Hotel eliminado correctamente por ID" };
  },

  deleteByName: async (name) => {
    const db = getDB();
    await db.query("DELETE FROM hotels WHERE name = ?", [name]);
    return { message: "Hotel eliminado correctamente por Nombre" };
  }
  
};

export default hotelsRepository;