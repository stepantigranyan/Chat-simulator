class Message {
    constructor({ user, message }) {
        this.user = user;
        this.message = message;
        this.date = this.__initDate__();
    }

    __initDate__() {
        const date = new Date();
        return date.getTime();
    }

    edit(message) {
        this.message = message;
    }

    delete() {}

    getUser() {
        return this.user;
    }

    getMessage() {
        return this.message;
    }
}

export default Message;
