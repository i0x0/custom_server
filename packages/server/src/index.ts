import Server from "./Server";
import { error } from "./utils";

try {
  let server = new Server()
  server.start()
} catch (e) {
  error(`global server error: ${e}`)
}