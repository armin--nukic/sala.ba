import { app } from "./app.js";
import { config } from "./config.js";

app.listen(config.port, () => {
  console.log(`sala.ba backend listening on ${config.port}`);
});
