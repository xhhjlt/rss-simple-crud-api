import { ServerResponse } from "http";

interface sendResponseProps {
  res: ServerResponse;
  code?: number;
  message?: string;
  data?: Record<any, any>;
}

export const sendResponse = ({ res, code = 200, message = "OK", data }: sendResponseProps) => {
  res.statusCode = code;
  res.statusMessage = message;
  if (data) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  } else {
    res.setHeader("Content-Type", "text/plain");
    res.end(`${code}: ${message}`);
  }
} 