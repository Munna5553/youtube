class ErrorHandler extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        Errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message;
        this.success = false
        this.Errors = Errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ErrorHandler }