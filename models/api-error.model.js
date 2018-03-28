class ApiError {

    constructor(message, status = 400) {
        this.message = message;
        this.status = status;
        console.log(status);
        console.log(message);        
    }
}

module.exports = ApiError;