import cuid from "cuid";
import validator from "validator";
const { isEmail, isAlphanumeric } = validator;
import db from "../db.mjs";

const Timer = db.model("Timer", {
    _id: { type: String, default: cuid },
    title: String,
    project: String,
    elapsed: { type: Number, default: 0},
    runningSince: { type: Number, default: null},
    user: { // Id
        type: String,
        ref: "User",
        index: true,
        required: true
    }
});

export async function create(fields) {
    const timer = await new Timer(fields).save();
    return timer;
}

export async function get(_id) {
    const timer = await Timer.findById(_id).populate("user").exec();
    return timer;
}

export async function list(user_id) {
    const timers = Timer.find({user: user_id});

    return timers;
}