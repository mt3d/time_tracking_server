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