import * as Users from "./models/users.mjs";
import * as Timers from "./models/timers.mjs";

export async function createUser(request, response, next) {
    try {
        const user = await Users.create(request.body);
        const { username, email } = user;
        response.json({ username, email });
    } catch (error) {
        next(error);
    }
}

export async function createTimer(request, response, next) {
    try {
        const { title, project, elapsed, runningSince } = request.body;

        const fields = {
            title, project, elapsed, runningSince
        }
        fields.user = request.user.user_id;

        const timer = await Timers.create(fields);

        response.json(timer);
        // response.json (all timers)?
    } catch (error) {
        next(error);
    }
}

export async function listTimers(request, response, next) {
    // This is set by the previous middleware, ensureUser.
    const user_id = request.user.user_id;

    const timers = await Timers.list(user_id);
    response.json(timers);
}

export async function editTimer(request, response, next) {
    const change = request.body;
    const timer = await Timers.edit(request.params.id, change);

    response.json({}); // all timers?
}

export async function removeTimer(request, response, next) {
    await Timers.remove(request.params.id);

    response.json({success: true});
}

export async function startTimer(request, response, next) {
    Timers.start(request.params.id, request.body.start);

    response.json({});
}

export async function stopTimer(request, response, next) {
    Timers.stop(request.params.id, request.body.stop);

    response.json({});
}