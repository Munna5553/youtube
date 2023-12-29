// httpStatusCodes.js

const StatusCodes = {
    // Informational 1xx
    100: {
        code: 100,
        message: 'Continue',
        comment: 'Server is ready for the request.',
    },
    101: {
        code: 101,
        message: 'Switching Protocols',
        comment: 'Server is switching protocols as requested.',
    },
    102: {
        code: 102,
        message: 'Processing',
        comment: 'Server has received and is processing the request, but no response is available yet.',
    },
    103: {
        code: 103,
        message: 'Early Hints',
        comment: 'Server is providing hints about a response that will be sent later.',
    },

    // Successful 2xx
    200: {
        code: 200,
        message: 'OK',
        comment: 'Request successful.',
    },
    201: {
        code: 201,
        message: 'Created',
        comment: 'Resource created successfully.',
        action: 'Redirect to the newly created resource.',
    },
    202: {
        code: 202,
        message: 'Accepted',
        comment: 'Request has been accepted for processing, but the processing has not been completed.',
    },
    203: {
        code: 203,
        message: 'Non-Authoritative Information',
        comment: 'Server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version of the origin\'s response.',
    },
    204: {
        code: 204,
        message: 'No Content',
        comment: 'Server successfully processed the request, but is not returning any content.',
    },
    205: {
        code: 205,
        message: 'Reset Content',
        comment: 'Server successfully processed the request, asks that the requester reset its document view, and is not returning any content.',
    },
    206: {
        code: 206,
        message: 'Partial Content',
        comment: 'Server is delivering only part of the resource due to a range header sent by the client.',
    },

    // Redirection 3xx
    300: {
        code: 300,
        message: 'Multiple Choices',
        comment: 'Multiple options for the resource are available.',
    },
    301: {
        code: 301,
        message: 'Moved Permanently',
        comment: 'Resource has moved permanently to a new location.',
        action: 'Redirect to the new location.',
    },
    302: {
        code: 302,
        message: 'Found',
        comment: 'Resource has been temporarily moved to a new location.',
        action: 'Redirect to the new location.',
    },
    303: {
        code: 303,
        message: 'See Other',
        comment: 'Client should look at another location for the resource.',
        action: 'Redirect to the other location.',
    },
    304: {
        code: 304,
        message: 'Not Modified',
        comment: 'Resource has not been modified since the last request.',
    },
    305: {
        code: 305,
        message: 'Use Proxy',
        comment: 'Client must use the specified proxy to access the resource.',
        action: 'Redirect to the proxy.',
    },
    307: {
        code: 307,
        message: 'Temporary Redirect',
        comment: 'Client must use the specified proxy to access the resource.',
        action: 'Redirect to the proxy.',
    },

    // Client Error 4xx
    400: {
        code: 400,
        message: 'Bad Request',
        comment: 'Server didn\'t understand the URL you gave it.',
    },
    401: {
        code: 401,
        message: 'Unauthorized',
        comment: 'Must be authenticated.',
    },
    402: {
        code: 402,
        message: 'Payment Required',
        comment: 'Not used really.',
    },
    403: {
        code: 403,
        message: 'Forbidden',
        comment: 'Server refuses to give you a file, authentication won\'t help.',
    },
    404: {
        code: 404,
        message: 'Not Found',
        comment: 'A file doesn\'t exist at that address.',
    },
    405: {
        code: 405,
        message: 'Method Not Allowed',
        comment: 'The method specified in the request is not allowed for the resource.',
    },
    406: {
        code: 406,
        message: 'Not Acceptable',
        comment: 'The resource identified by the request is only capable of generating response entities that have content characteristics not acceptable according to the accept headers sent in the request.',
    },
    407: {
        code: 407,
        message: 'Proxy Authentication Required',
        comment: 'Similar to 401 Unauthorized, but it indicates that the client must first authenticate itself with the proxy.',
    },
    408: {
        code: 408,
        message: 'Request Timeout',
        comment: 'The server timed out waiting for the request.',
    },
    409: {
        code: 409,
        message: 'Conflict',
        comment: 'Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates.',
    },
    410: {
        code: 410,
        message: 'Gone',
        comment: 'Indicates that the resource requested is no longer available and will not be available again.',
    },
    411: {
        code: 411,
        message: 'Length Required',
        comment: 'The request did not specify the length of its content, which is required by the requested resource.',
    },
    412: {
        code: 412,
        message: 'Precondition Failed',
        comment: 'The server does not meet one of the preconditions that the requester put on the request.',
    },
    413: {
        code: 413,
        message: 'Request Entity Too Large',
        comment: 'The request is larger than the server is willing or able to process.',
    },
    414: {
        code: 414,
        message: 'Request-URI Too Long',
        comment: 'The URI provided was too long for the server to process.',
    },
    415: {
        code: 415,
        message: 'Unsupported Media Type',
        comment: 'The request entity has a media type that the server or resource does not support.',
    },
    416: {
        code: 416,
        message: 'Requested Range Not Satisfiable',
        comment: 'The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.',
    },
    417: {
        code: 417,
        message: 'Expectation Failed',
        comment: 'The server cannot meet the requirements of the Expect request-header field.',
    },

    // Server Error 5xx
    500: {
        code: 500,
        message: 'Internal Server Error',
        comment: 'Something on the server didn\'t work right.',
    },
    501: {
        code: 501,
        message: 'Not Implemented',
        comment: 'The server does not support the functionality required to fulfill the request.',
    },
    502: {
        code: 502,
        message: 'Bad Gateway',
        comment: 'The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.',
    },
    503: {
        code: 503,
        message: 'Service Unavailable',
        comment: 'The server is not ready to handle the request. Common causes of this error include temporary overloading or maintenance of the server.',
    },
    504: {
        code: 504,
        message: 'Gateway Timeout',
        comment: 'The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server or some other auxiliary server it needed to access in order to complete the request.',
    },
    505: {
        code: 505,
        message: 'HTTP Version Not Supported',
        comment: 'The server does not support, or refuses to support, the HTTP protocol version that was used in the request message.',
    },
};

export { StatusCodes };
