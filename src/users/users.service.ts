import { IUsersService, User } from "./users.model.ts";
import { v4 as uuid } from "uuid";

export class UsersService implements IUsersService {
  private data: User[];

  constructor() {
    this.data = [];
  }

  async getAllUsers() {
    return this.data;
  }

  async getUserById(id: string) {
    return this.data.find((user) => user.id === id) || null;
  }

  async createUser(user: Omit<User, "id">) {
    const newUser = {
      id: uuid(),
      ...user,
    };
    this.data.push(newUser);
    return newUser;
  }

  async updateUser(id: string, user: Partial<Omit<User, "id">>) {
    const index = this.data.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...user };
    }
    return this.data[index] || null;
  }

  async deleteUser(id: string) {
    const index = this.data.findIndex((user) => user.id === id);
    const deletedUser = this.data[index];
    if (index !== -1) {
      this.data.splice(index, 1);
    }
    return deletedUser || null;
  }
}
