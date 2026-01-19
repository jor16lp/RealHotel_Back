import usersService from "../services/usersService.js";

export const getAll = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios", error: err });
  }
};

export const getById = async (req, res) => {
  try {
    const user = await usersService.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuario", error: err });
  }
};

export const getByEmail = async (req, res) => {
  try {
    const user = await usersService.getByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuario", error: err });
  }
};

export const create = async (req, res) => {
  try {
    const newUser = await usersService.create(req.body);
    res.status(201).json({message: "Usuario creado correctamente con ID: " + newUser.id});
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ message: "Error al crear usuario", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña obligatorios" });
    }

    const user = await usersService.getByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "El email o la contraseña es incorrecto" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "El email o la contraseña es incorrecto" });
    }

    // Login correcto
    res.json({
      email: user.email,
      name: user.name,
      surname: user.surname,
      role: user.email === "admin@gmail.com" ? "ADMIN" : "USER"
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error en login" });
  }
};

export const update = async (req, res) => {
  try {
    const updatedUser = await usersService.update(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar usuario", error: err });
  }
};

export const deleteByIdOrEmail = async (req, res) => {
  const value = req.params.value;
  try {
    let result;
    if (!isNaN(value)) {
      // Si es número → borrar por id
      result = await usersService.deleteById(Number(value));
    } else {
      // Si es texto → borrar por nombre
      result = await usersService.deleteByEmail(value);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar usuario", error: err });
  }
};
