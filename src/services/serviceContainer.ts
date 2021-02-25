//IOC container could be used for dependency injection (DI)

import { User } from "entity/user";
import { Repository } from "typeorm";
import { UserService } from "./userService";

class Container implements ServiceContainer {
  constructor() {
    this.services = new Map();
  }

  private services: Map<string, any>;

  userRepo: Repository<User>;
  userService: UserService;

  // service(name, cb) {
  //   //adds the properties to the object so they can be accessed like regular properties
  //   Object.defineProperty(this, name, {
  //     get: () => {
  //       if (!this.services.hasOwnProperty(name)) {
  //         this.services[name] = cb(this);
  //       }

  //       return this.services[name];
  //     },
  //     configurable: true,
  //     enumerable: true,
  //   });

  //   return this;
  // }

  addService(name: string, cb: CallableFunction) {
    if (!this.services.has(name)) {
      this.services.set(name, cb(this));
    }

    return this.services.get(name);
  }

  get(service: string) {
    if (this.services.has(service)) {
      return this.services.get(service);
    }
  }
}

interface ServiceContainer {
  userRepo: Repository<User>;
  userService: UserService;
}

export { Container, ServiceContainer };
