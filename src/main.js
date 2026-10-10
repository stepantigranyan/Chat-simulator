import MessageBox from './core/messageBox.js';
import store from './core/store/index.js';

import { debounce, sleep, generateID } from './helpers/index.js';
import { USERS, EVENTS, DEBOUNCE_MS, SCROLL_HEIGHT } from './consts/index.js';

const chatContainer = document.getElementById('chat-container');

const firstUserInput = document.getElementById('user-1');
const secondUserInput = document.getElementById('user-2');

const firstUserSubmitButton = document.getElementById('user-1-submit');
const secondUserSubmitButton = document.getElementById('user-2-submit');

const informTypingContainer = document.getElementById('inform-typing');
const statusSpinner = document.getElementById('spinner');

const firstUserMessage = {
    message: '',
    user: USERS.FIRST,
    id: undefined,
};

const secondUserMessage = {
    message: '',
    user: USERS.SECOND,
    id: undefined,
};

const pagination = {
    isFetching: false,
    from: 0,
    to: 10,
};

const clearTypingContainer = () => {
    informTypingContainer.innerText = '';
};

const debClearTypingContainer = debounce(clearTypingContainer, DEBOUNCE_MS);

const handleInputFirstUser = (event) => {
    const { value } = event.target;

    if (value.trim() === '') {
        firstUserSubmitButton.disabled = true;
        return;
    }

    firstUserSubmitButton.disabled = false;

    firstUserMessage.message = value;
    informTypingContainer.innerText = 'User 1 is typing...';
    debClearTypingContainer();
};

const handleInputSecondUser = (event) => {
    const { value } = event.target;

    if (value.trim() === '') {
        secondUserSubmitButton.disabled = true;
        return;
    }

    secondUserSubmitButton.disabled = false;

    secondUserMessage.message = value;
    informTypingContainer.innerText = 'User 2 is typing...';
    debClearTypingContainer();
};

const sendFirstUserMessage = () => {
    firstUserMessage.id = generateID();

    const message = new MessageBox(firstUserMessage);
    store.add(firstUserMessage);

    chatContainer.prepend(message.getElement());

    firstUserMessage.message = '';
    firstUserMessage.id = undefined;
    firstUserInput.value = '';
    clearTypingContainer();

    firstUserSubmitButton.disabled = true;
};

const sendSecondUserMessage = () => {
    secondUserMessage.id = generateID();

    const message = new MessageBox(secondUserMessage);
    store.add(message);

    chatContainer.prepend(message.getElement());

    secondUserMessage.message = '';
    secondUserMessage.id = undefined;
    secondUserInput.value = '';
    clearTypingContainer();

    secondUserSubmitButton.disabled = true;
};

const sendFirstUserMessageWhenEnter = (event) => {
    if (event.key !== 'Enter') {
        return;
    }

    if (firstUserInput.value.trim() === '') {
        return;
    }

    sendFirstUserMessage();
};

const sendSecondUserMessageWhenEnter = (event) => {
    if (event.key !== 'Enter') {
        return;
    }

    if (secondUserInput.value.trim() === '') {
        return;
    }

    sendSecondUserMessage();
};

const fetchOldMessages = async () => {
    const maxScrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;
    const currentScrollFromBottom = Math.abs(chatContainer.scrollTop);

    if (currentScrollFromBottom >= (maxScrollTop - SCROLL_HEIGHT) && !pagination.isFetching) {
        pagination.isFetching = true;

        pagination.from += 10;
        pagination.to += 10;

        const oldMessages = store.get(pagination.from, pagination.to);

        if (oldMessages.length === 0) {
            pagination.isFetching = false;
            return;
        }

        statusSpinner.classList.remove('hidden');
        statusSpinner.classList.add('block');

        await sleep(2000);

        oldMessages.forEach((message) => {
            chatContainer.append(message.getElement());
        });

        statusSpinner.classList.remove('block');
        statusSpinner.classList.add('hidden');

        pagination.isFetching = false;
    }
}

const start = () => {
    const oldMessages = store.get(pagination.from, pagination.to);

    oldMessages.forEach((message) => {
        chatContainer.append(message.getElement());
    });

    firstUserInput.addEventListener(EVENTS.INPUT, handleInputFirstUser);
    secondUserInput.addEventListener(EVENTS.INPUT, handleInputSecondUser);

    firstUserInput.addEventListener(
        EVENTS.KEYDOWN,
        sendFirstUserMessageWhenEnter,
    );
    secondUserInput.addEventListener(
        EVENTS.KEYDOWN,
        sendSecondUserMessageWhenEnter,
    );

    firstUserSubmitButton.addEventListener(EVENTS.CLICK, sendFirstUserMessage);
    secondUserSubmitButton.addEventListener(
        EVENTS.CLICK,
        sendSecondUserMessage,
    );

    chatContainer.addEventListener(EVENTS.SCROLL, fetchOldMessages);
};

start();
