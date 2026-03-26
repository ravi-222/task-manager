import { userRepository } from "../repositories/user.repository";

export const userService = {
  async findAll() {
    return userRepository.findAll();
  },
};
