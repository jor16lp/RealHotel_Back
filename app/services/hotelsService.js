import hotelsRepository from "../repositories/hotelsRepository.js";
const hotelsService = {
  getAll: async () => await hotelsRepository.getAll(),
  getById: async (id) => await hotelsRepository.getById(id),
  getByName: async (name) => await hotelsRepository.getByName(name),
  getCities: async () => await hotelsRepository.getCities(),
  create: async (hotel) => await hotelsRepository.create(hotel),
  update: async (id, hotel) => await hotelsRepository.update(id, hotel),
  deleteById: async (id) => await hotelsRepository.deleteById(id),
  deleteByName: async (name) => await hotelsRepository.deleteByName(name),
};

export default hotelsService;