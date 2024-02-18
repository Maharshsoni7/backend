class ApiResponse {
    constructor(statuesCode, data, message = 'Success') {
        this.statuesCode = statuesCode
        this.data = data
        this.message = message
        this.success = statuesCode < 400
    }
}

export { ApiResponse }