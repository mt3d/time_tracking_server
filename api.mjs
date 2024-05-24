import { create } from "./models/users.mjs";

export async function createUser(request, response, next) {
    const user = await create(request.body);
    const { username, email } = user;
    response.json({ username, email });
}