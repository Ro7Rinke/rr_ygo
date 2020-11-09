class Error {
    constructor(code, message, details, date) {
        this.code = code
        this.message = message
        this.details = details
        this.date = date
        this.is_error = true
    }
}

module.exports = Error