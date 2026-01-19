import { getDB } from "./connection.js";

const usersRepository = {
  getAll: async () => {
    try {
      const [rows] = await getDB().query("SELECT * FROM users");
      return rows;
    } catch (err) {
      console.error("Error al insertar usuario:", err);
    }
  },

  getById: async (id) => {
    const [rows] = await getDB().query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  getByEmail: async (email) => {
    const [rows] = await getDB().query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  create: async (user) => {
    const { email, password, name, surname } = user;
    const role = email === "admin@gmail.com" ? "ADMIN" : "USER";
    try {
      const [result] = await getDB().query(
        "INSERT INTO users (email, password, name, surname, role) VALUES (?, ?, ?, ?, ?)",
        [email, password, name, surname, role]
      );
      console.log("Usuario insertado con id:", result.insertId);
      return { id: result.insertId, ...user };
    } catch (err) {
      console.error("Error al insertar usuario:", err);
    }
  },

  update: async (id, user) => {
    const { email, password, name, surname } = user;
    const role = email === "admin@gmail.com" ? "ADMIN" : "USER";
    await getDB().query(
      "UPDATE users SET email = ?, password = ?, name = ?, surname = ?, role = ? WHERE id = ?",
      [email, password, name, surname, role, id]
    );
    return { id, ...user };
  },

  deleteById: async (id) => {
    await getDB().query("DELETE FROM users WHERE id = ?", [id]);
    return { message: "Usuario eliminado correctamente por ID" };
  },

  deleteByEmail: async (email) => {
    await getDB().query("DELETE FROM users WHERE email = ?", [email]);
    return { message: "Usuario eliminado correctamente por Email" };
  }
};

export default usersRepository;
