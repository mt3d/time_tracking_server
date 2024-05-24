export function cors(request, response, next) {
    const origin = request.headers.origin;

    response.setHeader('Access-Control-Allow-Origin', origin || '*');
    response.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, DELETE, OPTIONS, XMODIFY'
    );
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Max-Age', '86400');
    response.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    next();
}

// A middleware to catch internal errors
export function handleError (error, request, response, next) {
    console.log(error);

    if (response.headersSent) {
        return next(error);
    }

    response.status(500).json({ error: "Internal server error"});
}

// A catch all error handler, for the case where no route handler
// matches the request URL.
export function notFound(request, response) {
    response.status(404).json({ error: "Not found"});
}