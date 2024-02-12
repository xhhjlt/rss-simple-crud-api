import http from "http";
import { UsersController } from "./users/users.controller.ts";
import { UsersService } from "./users/users.service.ts";
import { ErrorWithStatus, throw404 } from "./lib/errors.ts";
import { usersControllerPathRegexp } from "./users/users.model.ts";
import { sendResponse } from "./lib/sendResponse.ts";

const usersController = new UsersController(new UsersService());

export const server = http.createServer((req, res) => {
  try {
    if (req.url?.match(usersControllerPathRegexp)) {
      usersController.router(req, res);
    } else {
      throw404();
    }
  } catch (error) {
    const errorWithStatus = error as ErrorWithStatus;
    const code = errorWithStatus.status || 500;
    const message = errorWithStatus.message || "Internal Server Error";
    sendResponse({ res, code, message})
  }
});
