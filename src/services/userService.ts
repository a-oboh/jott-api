import { getRepository } from "typeorm";
import { User } from "../entity/user/user";
import { HttpError } from "../helpers/httpError";

export class UserService {
  async getUserByEmail(email: string) {
    let userRepository = getRepository(User);

    const user = await userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpError(`User with email: ${email} does not exist`, 404);
  }

  async createUser(data: User) {
    let userRepository = getRepository(User);

    try {
      const user = userRepository.create(data);

      const savedUser = await userRepository.save(user);

      console.log(savedUser);

      return (savedUser as unknown) as User;
    } catch (err) {
      throw new HttpError(err.message, 500);
    }
  }
}
