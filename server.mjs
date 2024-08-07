import express from "express";
import bodyParser from "body-parser";
import * as api from "./api.mjs";
import * as middleware from "./middleware.mjs";
import { authenticate, login, ensureUser } from "./auth.mjs";

const app = express();
app.set("port", (process.env.PORT || 2000));

app.use(middleware.cors)
app.use(bodyParser.json());

app.post("/login", authenticate, login);
app.post("/signup", api.createUser);

app.get("/timers", ensureUser, api.listTimers);
app.post("/timers", ensureUser, api.createTimer);
app.put("/timers:id", ensureUser, api.editTimer);
app.delete("/timers:id", ensureUser, api.removeTimer);
app.post("/timers/start:id", ensureUser, api.startTimer);
app.post("/timers/stop:id", ensureUser, api.stopTimer);

app.use(middleware.handleError);
app.use(middleware.notFound);

app.listen(app.get("port"), () => {
    console.log(`Listening at: http://localhost:${app.get("port")}`);
});