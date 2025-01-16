export class TimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TimeoutError";
    }
}

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthenticationError";
    }
}

export class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NetworkError";
    }
}

export class ServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ServerError";
    }
}
