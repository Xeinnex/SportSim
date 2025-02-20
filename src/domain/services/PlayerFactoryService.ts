import { faker } from "@faker-js/faker";

export class PlayerFactoryService {
  static generatePlayerInfo() {
    const age = faker.number.int({ min: 16, max: 40 });
    let name = faker.person.firstName();
    let lastName = faker.person.lastName();
    do {
      name = faker.person.firstName("male");
    } while (name.length > 8);

    do {
      lastName = faker.person.lastName();
    } while (lastName.length > 8);

    return { name, lastName, age };
  }
}
