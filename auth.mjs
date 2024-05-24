import jwt from "jsonwebtoken";
import passport from "passport";
import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";
import * as Users from "./models/users.mjs";

const jwtSecret = process.env.JWT_SECRET || "choose_a_random_secret_in_production";
const jwtOptions = { algorithm: "HS256", expiresIn: "30d" };

passport.use(userStrategy());
export const authenticate = passport.authenticate("local", { session: false });

export async function login(request, response, next) {
    const token = await sign({ username: request.user.username });
    response.cookie("jwt", token, { httpOnly: true });
    response.json({ success: true, token: token });
}

async function sign(payload) {
    const token = await jwt.sign(payload, jwtSecret, jwtOptions);
    return token;
}

export async function ensureUser(request, response, next) {
    const jwtString = request.headers.authorization || request.cookies.jwt;
    const payload = await verify(jwtString);

    if (payload.username) {
        request.user = payload;
        return next();
    }

    const error = new Error("Unauthorized");
    error.statusCode = 401;
    next(error);
}

async function verify(jwtString = "") {
    jwtString = jwtString.replace(/^Bearer /i, "");

    try {
        const payload = await jwt.verify(jwtString, jwtSecret);
        return payload;
    } catch (error) {
        error.statusCode = 401;
        throw error;
    }
}

function userStrategy() {
    return new LocalStrategy(async function (username, password, callback) {
        try {
            const user = await Users.get(username);

            if (!user) {
                return callback(null, false);
            }

            const isUser = await bcrypt.compare(password, user.password);

            if (isUser) {
                return callback(null, { username: user.username });
            }
        } catch (error) {}

        callback(null, false);
    });
}