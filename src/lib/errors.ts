export interface ErrorWithStatus extends Error {
  status?: number;
}

export const throwError = (message: string, status: number) => {
  const error: ErrorWithStatus = new Error(message);
  error.status = status;
  throw error;
};

export const throw400 = (message?: string) =>
  throwError(message || "Bad request", 400);

export const throw404 = (message?: string) =>
  throwError(message || "Not found", 404);

export const throw500 = (message?: string) =>
  throwError(message || "Internal Server Error", 500);

export const throw418 = () => throwError("I’m a teapot", 418);
