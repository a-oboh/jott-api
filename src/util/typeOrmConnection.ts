import { User } from "entity/user";
import {
  createConnection,
  getConnection,
  getConnectionOptions,
  getRepository,
} from "typeorm";

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
  newUser.password = "secret";

  const userRepository = getRepository(User);

  const user = userRepository.create(newUser);

  await userRepository.save(user);

  console.log('saved user')
};

 const cleanDb = async () => {
  const entities = await getEntities();
  await cleanAll(entities);
}

const getEntities = async () => {
  const entities = [];
    (await (await getConnection()).entityMetadatas).forEach(
      x => entities.push({name: x.name, tableName: x.tableName})
    );
    return entities;
}

 const cleanAll = async (entities) => {
  try {
    for (const entity of entities) {
      const repository = await getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE \`${entity.tableName}\`;`);
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}


export { createTypeOrmConnection, createTestUsers, closeConnection, cleanDb };
