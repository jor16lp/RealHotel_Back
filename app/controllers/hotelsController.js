import hotelsService from "../services/hotelsService.js";

export const getAll = async (req, res) => {
  try {
    const hotels = await hotelsService.getAll();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios", error: err });
  }
};

export const getByIdOrName = async (req, res) => {
  const value = req.params.value;

  try {
    let result;
    if (!isNaN(value)) {
      // Si es número → buscar por id
      result = await hotelsService.getById(Number(value));
    } else {
      // Si es texto → buscar por nombre
      result = await hotelsService.getByName(value);
    }

    if (!result) return res.status(404).json({ message: "Hotel no encontrado" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar hotel", error: err });
  }
};

export const create = async (req, res) => {
  try {
    const newHotel = await hotelsService.create(req.body);
    res.status(201).json({message: "Hotel añadido correctamente con ID: " + newHotel.id});
  } catch (err) {
    console.error("Error al crear hotel:", err);
    res.status(500).json({ message: "Error al crear hotel", error: err });
  }
};

export const update = async (req, res) => {
  try {
    const updatedHotel = await hotelsService.update(req.params.id, req.body);
    res.json(updatedHotel);
  } catch (err) {
    console.error("Error al actualizar hotel:", err);
    res.status(500).json({ message: "Error al actualizar hotel", error: err });
  }
};

export const deleteByIdOrName = async (req, res) => {
  const value = req.params.value;
  try {
    let result;
    if (!isNaN(value)) {
      // Si es número → borrar por id
      result = await hotelsService.deleteById(Number(value));
    } else {
      // Si es texto → borrar por nombre
      result = await hotelsService.deleteByName(value);
    }

    res.json(result);
  } catch (err) {
    console.error("Error al eliminar hotel:", err);
    res.status(500).json({ message: "Error al eliminar hotel", error: err });
  }
};