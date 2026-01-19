import { getDB } from "./connection.js";

const ratingsRepository = {
  getAll: async () => {
    const [rows] = await getDB().query("SELECT * FROM usersRatings");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await getDB().query("SELECT * FROM usersRatings WHERE id = ?", [id]);
    return rows[0];
  },

  getByUser: async (userEmail) => {
    const [rows] = await getDB().query("SELECT * FROM usersRatings WHERE userEmail = ?", [userEmail]);
    return rows;
  },

  getByHotel: async (hotelName) => {
    const [rows] = await getDB().query("SELECT r.rating, r.comment, u.name, u.surname FROM usersratings r JOIN users u ON r.userEmail = u.email WHERE r.hotelName = ?", [hotelName]);
    return rows;
  },
  
  getByEmailAndHotel: async (userEmail, hotelName) => {
    const [rows] = await getDB().query("SELECT r.id, r.rating, r.comment, r.userEmail, r.hotelName FROM usersratings r WHERE r.userEmail = ? AND r.hotelName = ?", [userEmail, hotelName]);
    return rows.length ? rows[0] : null;
  },

  create: async (userRating) => {
    const { rating: rating, userEmail, hotelName, comment } = userRating;
    const [result] = await getDB().query(
      "INSERT INTO usersRatings (rating, userEmail, hotelName, comment) VALUES (?, ?, ?, ?)",
      [rating, userEmail, hotelName, comment]
    );
    return { id: result.insertId, ...rating };
  },

  update: async (id, rating) => {
    const { rating: score, userEmail, hotelName, comment } = rating;
    await getDB().query(
      "UPDATE usersRatings SET rating = ?, userEmail = ?, hotelName = ?, comment = ? WHERE id = ?",
      [score, userEmail, hotelName, comment, id]
    );
    return { id, ...rating };
  },

  deleteById: async (id) => {
    await getDB().query("DELETE FROM usersRatings WHERE id = ?", [id]);
    return { message: "Valoración eliminada correctamente" };
  },
};

export default ratingsRepository;
