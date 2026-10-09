import MessageBox from "./core/messageBox.js";
import { debounce } from "./helpers/index.js";

const chatContainer = document.getElementById('chat-container');

const firstUserInput = document.getElementById('user-1');
const secondUserInput = document.getElementById('user-2');

const firstUserSubmitButton = document.getElementById('user-1-submit');
const secondUserSubmitButton = document.getElementById('user-2-submit');

const informTypingContainer = document.getElementById('inform-typing');

const firstUserMessage = {
    message: undefined,
    user: 'user-1'
}

const secondUserMessage = {
    message: undefined,
    user: 'user-2'
}

const messages = [];

const clearTypingContainer = () => {
    informTypingContainer.innerText = '';
}

const debClearTypingContainer = debounce(clearTypingContainer, 2000);

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
}

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
}

const sendFirstUserMessage = () => {
    const message = new MessageBox(firstUserMessage);
    messages.unshift(message);
    chatContainer.prepend(message.getElement());

    firstUserMessage.message = '';
    firstUserInput.value = '';

    firstUserSubmitButton.disabled = true;
}

const sendSecondUserMessage = () => {
    const message = new MessageBox(secondUserMessage);
    messages.unshift(message.getElement());
    chatContainer.prepend(message.getElement());

    secondUserMessage.message = '';
    secondUserInput.value = '';

    secondUserSubmitButton.disabled = true;
}

const sendFirstUserMessageWhenEnter = (event) => {
    if (event.key !== 'Enter') {
        return;
    }

    if (firstUserInput.message === '') {
        return;
    }

    const message = new MessageBox(firstUserMessage);
    messages.unshift(message);
    chatContainer.prepend(message.getElement());

    firstUserMessage.message = '';
    firstUserInput.value = '';

    firstUserSubmitButton.disabled = true;
}

const sendSecondUserMessageWhenEnter = (event) => {
    if (event.key !== 'Enter') {
        return;
    }

    if (secondUserInput.message === '') {
        return;
    }

    const message = new MessageBox(secondUserMessage);
    messages.unshift(message);
    chatContainer.prepend(message.getElement());

    secondUserMessage.message = '';
    secondUserInput.value = '';

    secondUserSubmitButton.disabled = true;
}

firstUserInput.addEventListener('input', handleInputFirstUser);
secondUserInput.addEventListener('input', handleInputSecondUser);

firstUserInput.addEventListener('keydown', sendFirstUserMessageWhenEnter);
secondUserInput.addEventListener('keydown', sendSecondUserMessageWhenEnter);

firstUserSubmitButton.addEventListener('click', sendFirstUserMessage);
secondUserSubmitButton.addEventListener('click', sendSecondUserMessage);

const start = () => {

}