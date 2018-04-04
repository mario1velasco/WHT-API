class ApiError {

    constructor(message, status = 400, errors = {}) {
        this.message = message;
        this.status = status;
        this.errors = errors;
        console.log(status);
        console.log(message);        
    }
}

module.exports = ApiError;