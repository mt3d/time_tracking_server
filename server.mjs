import express from "express";
import bodyParser from "body-parser";
import * as api from "./api.mjs";
import * as middleware from "./middleware.mjs";

const app = express();
app.set("port", (process.env.PORT || 2000));

app.use(middleware.cors)
app.use(bodyParser.json());

app.post("/users", api.createUser);

app.use(middleware.handleError);
app.use(middleware.notFound);

app.listen(app.get("port"), () => {
    console.log(`Listening at: http://localhost:${app.get("port")}`);
});