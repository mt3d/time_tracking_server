import express from "express";

const app = express();
app.set("port", (process.env.PORT || 2000));
app.listen(app.get("port"), () => {
    console.log(`Listening at: http://localhost:${app.get("port")}`);
});