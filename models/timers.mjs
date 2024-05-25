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

export async function edit(id, change) {
    const timer = await get(id);

    Object.keys(change).forEach(function (key){
        timer[key] = change[key];
    });

    await timer.save();
    return timer;
}

export async function remove(id) {
    await Timer.deleteOne({ id });
}

export async function start(id, startTime) {
    const timer = await get(id);
    timer.runningSince = startTime;
    await timer.save();

    return timer;
}

export async function stop(id, stopTime) {
    const timer = await get(id);
    const delta = stopTime - timer.runningSince;
    timer.elapsed += delta;
    timer.runningSince = null;
    await timer.save();

    return timer;
}