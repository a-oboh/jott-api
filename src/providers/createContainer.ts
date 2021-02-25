import { Container } from "services/serviceContainer";
import { ContainerBuilder } from "node-dependency-injection";
import { getRepository } from "typeorm";
import { User } from "entity/user/user";
import { UserService } from "services/userService";

const createContainer = async () => {
  let container = new ContainerBuilder();

  const userRepo = await getRepository(User);

  container.register("repo.user", userRepo);
  container.register("service.user", UserService).addArgument(userRepo);

  return container;
};

export { createContainer };
