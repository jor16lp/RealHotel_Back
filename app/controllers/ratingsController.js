import ratingsService from "../services/ratingsService.js";

export const getAll = async (req, res) => {
  try {
    const ratings = await ratingsService.getAll();
    console.log(ratings)
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener valoraciones", error: err });
  }
};

export const getById = async (req, res) => {
  try {
    const rating = await ratingsService.getById(req.params.id);
    if (!rating) return res.status(404).json({ message: "Valoración no encontrada" });
    res.json(rating);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener valoración", error: err });
  }
};

export const getByUser = async (req, res) => {
  try {
    const ratings = await ratingsService.getByUser(req.params.userEmail);
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener valoraciones del usuario", error: err });
  }
};

export const getByHotel = async (req, res) => {
  try {
    const ratings = await ratingsService.getByHotel(req.params.hotelName);
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener valoraciones del hotel", error: err });
  }
};

export const getByEmailAndHotel = async (req, res) => {
  try {
    const rating = await ratingsService.getByEmailAndHotel(req.params.userEmail, req.params.hotelName);
    res.json(rating);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener la valoración de dicho usuario y hotel", error: err });
  }
};

export const create = async (req, res) => {
  try {
    const newRating = await ratingsService.create(req.body);
    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ message: "Error al crear valoración", error: err });
  }
};

export const update = async (req, res) => {
  try {
    const updatedRating = await ratingsService.update(req.params.id, req.body);
    res.json(updatedRating);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar valoración", error: err });
  }
};

export const deleteById = async (req, res) => {
  try {
    const result = await ratingsService.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar valoración", error: err });
  }
};
