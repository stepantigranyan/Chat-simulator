import MessageBox from '../messageBox.js';

class Store {
    add({ message, user, id }) {
        const newMessage = {
            message,
            user,
            id,
        };

        const oldMessages = JSON.parse(localStorage.getItem('messages'));

        if (oldMessages === null) {
            const newMessages = [newMessage];
            localStorage.setItem('messages', JSON.stringify(newMessages));
            return;
        }

        oldMessages.unshift(newMessage);
        localStorage.setItem('messages', JSON.stringify(oldMessages));
    }

    get(from, to) {
        const oldMessages = JSON.parse(localStorage.getItem('messages'));

        if (oldMessages === null) {
            return [];
        }

        const returnedMessages = [];

        for (let i = from; i < to; i++) {
            if (oldMessages[i] === undefined) {
                break;
            }

            returnedMessages.push(new MessageBox(oldMessages[i]));
        }

        return returnedMessages;
    }

    edit(id, message) {
        const messages = JSON.parse(localStorage.getItem('messages'));
        const editedMessage = messages.find((message) => message.id === id);

        editedMessage.message = message;
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    delete(id) {
        const messages = JSON.parse(localStorage.getItem('messages'));
        const newMessages = messages.filter(
            (deletedMessage) => deletedMessage.id !== id,
        );

        localStorage.setItem('messages', JSON.stringify(newMessages));
    }
}

export default new Store();
