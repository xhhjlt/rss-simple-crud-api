import { config } from "dotenv";
import { server } from "./App.ts";

config();
const port = +(process.env.PORT || 4000);

server.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
