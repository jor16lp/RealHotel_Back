import ratingsRepository from "../repositories/ratingsRepository.js";

const ratingsService = {
  getAll: async () => await ratingsRepository.getAll(),
  getById: async (id) => await ratingsRepository.getById(id),
  getByUser: async (userEmail) => await ratingsRepository.getByUser(userEmail),
  getByHotel: async (hotelName) => await ratingsRepository.getByHotel(hotelName),
  getByEmailAndHotel: async (userEmail, hotelName) => await ratingsRepository.getByEmailAndHotel(userEmail, hotelName),
  create: async (rating) => await ratingsRepository.create(rating),
  update: async (id, rating) => await ratingsRepository.update(id, rating),
  deleteById: async (id) => await ratingsRepository.deleteById(id),
};

export default ratingsService;
