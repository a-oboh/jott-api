import { User } from "entity/user";
import {
  createConnection,
  getConnection,
  getConnectionOptions,
  getRepository,
  Connection,
} from "typeorm";

const createTypeOrmConnection = async (): Promise<Connection> => {
  //override connection options
  const connOptions = await getConnectionOptions(process.env.NODE_ENV);
  return await createConnection({ ...connOptions, name: "default" });
};

const connectTestDb = async (): Promise<void> => {
  let retries = 1;

  while (retries) {
    try {
      // await createTypeOrmConnection()
      const connOptions = await getConnectionOptions("test");
      await createConnection({ ...connOptions, name: "default" }).then(
        async () => {
          await createTestUsers();
        }
      );
    } catch (e) {
      console.log(e);
    }

    retries--;
  }
};

const closeConnection = async (): Promise<void> => {
  await getConnection().close();
};

const createTestUsers = async (): Promise<void> => {
  const newUser = new User();

  newUser.email = "ayooo@test.com";
  newUser.firstName = "Ayo";
  newUser.lastName = "Balogun";
  newUser.password = "secret";

  const userRepository = getRepository(User);

  const user = userRepository.create(newUser);

  await userRepository.save(user);

  console.log("saved user");
};

const cleanDb = async (): Promise<void> => {
  const entities = await getEntities();
  await cleanAll(entities);
};

const getEntities = async () => {
  const entities = [];
  (await (await getConnection()).entityMetadatas).forEach((x) =>
    entities.push({ name: x.name, tableName: x.tableName })
  );
  return entities;
};

const cleanAll = async (entities) => {
  try {
    for (const entity of entities) {
      const repository = await getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE \`${entity.tableName}\`;`);
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
};

export {
  createTypeOrmConnection,
  createTestUsers,
  closeConnection,
  cleanDb,
  connectTestDb,
};
