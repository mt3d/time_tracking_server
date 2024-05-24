import cuid from "cuid";
import bcrypt from "bcrypt";
import validator from "validator";
const { isEmail, isAlphanumeric } = validator;
import db from "../db.mjs";

const SALT_ROUNDS = 15;

const User = db.model("User", {
    _id: { type: String, default: cuid },
    username: usernameSchema(),
    password: { type: String, maxLength: 120, required: true },
    email: emailSchema({ required: true })
});

function usernameSchema() {
    return {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 3,
        maxLength: 16,
        validate: [
            {
                validator: isAlphanumeric,
                message: props => `${props.value} contains special characters`
            },
            {
                validator: function (username) { return isUnique(this, username) },
                message: props => "Username is taken"
            },
        ]
    }
}

function emailSchema(opts) {
    const { required } = opts;

    return {
        type: String,
        required: !!required,
        validate: { validator: isEmail, message: props => "Email is not valid" }
    }
}

async function isUnique(doc, username) {
    const existing = await get(username);
    return !existing || doc._id === existing._id;
}

export async function get(username) {
    const user = await User.findOne({ username });
    return user;
}

export async function remove(username) {
    await User.deleteOne({ username });
}

export async function create(fields) {
    const user = new User(fields);
    await hashPassword(user);
    await user.save();
    return user;
}

async function hashPassword (user) {
    if (!user.password) {
        // Document.prototype.invalidate()
        throw user.invalidate("password", "password is required");
    }
    if (user.password.length < 12) {
        throw user.invalidate("password", "password must be at least 12 characters");
    }

    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
}