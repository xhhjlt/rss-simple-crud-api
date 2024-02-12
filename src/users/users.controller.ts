import { IncomingMessage, ServerResponse } from "http";
import {
  IUsersService,
  User,
  allUsersPathRegexp,
  userByIdPathRegexp,
  uuidRegexp,
} from "./users.model.ts";
import { throw400, throw404 } from "../lib/errors.ts";
import { sendResponse } from "../lib/sendResponse.ts";

export class UsersController {
  private service: IUsersService;

  constructor(usersService: IUsersService) {
    this.service = usersService;
  }

  async router(req: IncomingMessage, res: ServerResponse) {
    switch (req.method) {
      case "GET":
        if (req.url?.match(allUsersPathRegexp)) {
          await this.getAllUsers(req, res);
        } else if (req.url?.match(userByIdPathRegexp)) {
          await this.getUserById(req, res);
        } else {
          throw404();
        }
        break;
      case "POST":
        if (req.url?.match(allUsersPathRegexp)) {
          await this.createUser(req, res);
        } else {
          throw404();
        }
        break;
      case "PUT":
        if (req.url?.match(userByIdPathRegexp)) {
          await this.updateUser(req, res);
        } else {
          throw404();
        }
        break;
      case "DELETE":
        if (req.url?.match(userByIdPathRegexp)) {
          await this.deleteUser(req, res);
        } else {
          throw404();
        }
        break;
      default:
        throw404();
        break;
    }
  }

  private validateUserData(data: User) {
    const result: Partial<Record<keyof User, string>> = {};
    if (!data.username) result.username = "Username is required";
    if (!data.age) result.age = "Age is required";
    if (!data.hobbies) result.hobbies = "Hobbies is required";
    return result;
  }

  private async parseUserData(req: IncomingMessage): Promise<User> {
    const data = {
      raw: "",
    };
    for await (const chunk of req) {
      data.raw += chunk;
    }
    return JSON.parse(data.raw);
  }

  private async getAllUsers(req: IncomingMessage, res: ServerResponse) {
    const users = await this.service.getAllUsers();
    sendResponse({ res, data: users });
  }

  private async getUserById(req: IncomingMessage, res: ServerResponse) {
    const userId = req.url?.split("/").pop() || "";
    if (!userId?.match(uuidRegexp)) throw400("User id is not valid");
    const user = await this.service.getUserById(userId);
    if (!user) {
      throw404("User not found");
      return;
    }
    sendResponse({ res, data: user });
  }

  private async createUser(req: IncomingMessage, res: ServerResponse) {
    const data = await this.parseUserData(req);
    const validationErrors = this.validateUserData(data);
    if (Object.entries(validationErrors).length) {
      sendResponse({
        res,
        code: 400,
        message: "Bad request",
        data: validationErrors,
      });
      return;
    }
    const user = await this.service.createUser(data);
    sendResponse({ res, code: 201, message: "Created", data: user });
  }

  private async updateUser(req: IncomingMessage, res: ServerResponse) {
    const userId = req.url?.split("/").pop() || "";
    if (!userId?.match(uuidRegexp)) throw400("User id is not valid");
    const data = await this.parseUserData(req);
    const user = await this.service.updateUser(userId, data);
    if (!user) {
      throw404("User not found");
      return;
    }
    sendResponse({ res, code: 200, message: "Updated", data: user })
  }

  private async deleteUser(req: IncomingMessage, res: ServerResponse) {
    const userId = req.url?.split("/").pop() || "";
    if (!userId?.match(uuidRegexp)) throw400("User id is not valid");
    const user = await this.service.deleteUser(userId);
    if (!user) {
      throw404("User not found");
      return;
    }
    sendResponse({ res, code: 204, message: "Deleted"})
  }
}
