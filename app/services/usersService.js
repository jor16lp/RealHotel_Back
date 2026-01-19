import usersRepository from "../repositories/usersRepository.js";

const usersService = {
  getAll: async () => await usersRepository.getAll(),
  getById: async (id) => await usersRepository.getById(id),
  getByEmail: async (email) => await usersRepository.getByEmail(email),
  create: async (user) => await usersRepository.create(user),
  update: async (id, user) => await usersRepository.update(id, user),
  deleteById: async (id) => await usersRepository.deleteById(id),
  deleteByEmail: async (email) => await usersRepository.deleteByEmail(email),
};

export default usersService;
