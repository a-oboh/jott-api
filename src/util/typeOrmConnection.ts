import { User } from "entity/user";
import {
  createConnection,
  getConnection,
  getConnectionOptions,
  getRepository,
} from "typeorm";
import bcrypt from "bcrypt";

const createTypeOrmConnection = async () => {
  //override connection options
  const connOptions = await getConnectionOptions(process.env.NODE_ENV);
  return await createConnection({ ...connOptions, name: "default" });
};

const closeConnection = async () => {
  await getConnection().close();
};

const createTestUsers = async () => {
  const newUser = new User();

  newUser.email = "user@test.com";
  newUser.firstName = "Ayo";
  newUser.lastName = "Balogun";
  newUser.password = await bcrypt.hash("secret", 10);

  const userRepository = getRepository(User);

  const user = userRepository.create(newUser);

  await userRepository.save(user);

  console.log('saved user')
};

export { createTypeOrmConnection, createTestUsers, closeConnection };
