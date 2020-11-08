export default class Error {
    constructor(code, message, details, date) {
        this.code = code
        this.message = message
        this.details = details
        this.date = date
    }
}