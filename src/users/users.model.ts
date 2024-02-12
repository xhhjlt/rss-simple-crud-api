export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUsersService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: Omit<User, "id">): Promise<User>;
  updateUser(id: string, user: Partial<Omit<User, "id">>): Promise<User | null>;
  deleteUser(id: string): Promise<User | null>;
}

export const usersControllerPathRegexp = /^\/api\/users.*$/i;
export const allUsersPathRegexp = /^\/api\/users\/?$/i;
export const userByIdPathRegexp = /^\/api\/users\/[^\/]*\/?$/i;
export const uuidRegexp =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
