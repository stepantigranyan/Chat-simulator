import store from './store/index.js';
import { USERS, EVENTS, SYMBOLS } from '../consts/index.js';

class MessageBox {
    constructor({ user, message, id }) {
        this.user = user;
        this.message = message;
        this.isEditable = true;
        this.id = id;

        this.messageBox = this.__init__();
    }

    __init__() {
        const { user, message, id } = this;

        const messagePlace = document.createElement('div');
        messagePlace.classList.add('w-full', 'flex');

        const messageBox = document.createElement('div');
        messageBox.classList.add(
            'group',
            'relative',
            'cursor-pointer',
            'max-w-1/2',
            'bg-primary-dirty-mid-green',
            'rounded-xl',
            'px-3',
            'py-1',
            'after:absolute',
            "after:content-['']",
            'after:top-full',
            'after:size-2',
            'after:bg-primary-dirty-mid-green',
            'after:rounded-full',
        );

        const messageSpan = document.createElement('span');
        messageSpan.classList.add(
            'block',
            'text-primary-milk-white',
            'break-all',
        );

        const messageArea = document.createElement('textarea');
        messageArea.classList.add(
            'border-none',
            'outline-none',
            'text-primary-milk-white',
            'break-all',
            'hidden',
            'w-full',
            'resize-none',
            'field-sizing-content',
        );

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add(
            'cursor-default',
            'absolute',
            'top-0',
            'h-full',
            'px-5',
            'hidden',
            'gap-x-3',
            'items-center',
            'group-hover:flex',
        );

        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');
        const buttonStyles = [
            'cursor-pointer',
            'size-8',
            'bg-primary-dirty-mid-green',
            'rounded-full',
            'flex',
            'justify-center',
            'items-center',
            'text-primary-milk-white',
            'text-sm',
        ];

        editButton.classList.add(...buttonStyles);

        deleteButton.classList.add(...buttonStyles);

        editButton.innerHTML = SYMBOLS.PEN;
        deleteButton.innerHTML = SYMBOLS.TRASH;

        const addEditStyles = () => {
            messageBox.classList.remove(
                'bg-primary-dirty-mid-green',
                'after:bg-primary-dirty-mid-green',
            );
            messageBox.classList.add(
                'bg-primary-dirty-dark-green',
                'after:bg-primary-dirty-dark-green',
            );

            messageSpan.classList.remove('block');
            messageSpan.classList.add('hidden');

            messageArea.classList.remove('hidden');
            messageArea.classList.add('block');

            editButton.classList.remove('bg-primary-dirty-mid-green');
            editButton.classList.add('bg-primary-dirty-dark-green');
        };

        const removeEditStyles = () => {
            messageBox.classList.remove(
                'bg-primary-dirty-dark-green',
                'after:bg-primary-dirty-dark-green',
            );
            messageBox.classList.add(
                'bg-primary-dirty-mid-green',
                'after:bg-primary-dirty-mid-green',
            );

            messageArea.classList.remove('block');
            messageArea.classList.add('hidden');

            messageSpan.classList.remove('hidden');
            messageSpan.classList.add('block');

            editButton.classList.remove('bg-primary-dirty-dark-green');
            editButton.classList.add('bg-primary-dirty-mid-green');
        };

        const onClickRemoveEdit = (event) => {
            const isClickInside = messageArea.contains(event.target);

            if (!isClickInside) {
                messageArea.removeEventListener(EVENTS.KEYDOWN, onSubmitEdit);

                removeEditStyles();
                window.removeEventListener(EVENTS.CLICK, onClickRemoveEdit);

                this.isEditable = true;
            }
        };

        const onSubmitEdit = (event) => {
            if (event.key === 'Enter' && messageArea.value.trim() !== '') {
                this.message = messageArea.value.trim();
                const { message } = this;

                store.edit(id, message);

                removeEditStyles();

                messageArea.removeEventListener(EVENTS.KEYDOWN, onSubmitEdit);
                window.removeEventListener(EVENTS.CLICK, onClickRemoveEdit);
                messageArea.value = message;

                messageSpan.innerText = message;
                this.isEditable = true;
            }
        };

        const onClickEdit = (event) => {
            event.stopPropagation();
            const { isEditable } = this;

            if (isEditable) {
                const { message } = this;

                messageArea.value = message;
                messageSpan.innerText = message;

                addEditStyles();

                messageArea.focus();
                messageArea.addEventListener(EVENTS.KEYDOWN, onSubmitEdit);
                window.addEventListener(EVENTS.CLICK, onClickRemoveEdit);

                this.isEditable = false;
            } else {
                removeEditStyles();
                messageArea.removeEventListener(EVENTS.KEYDOWN, onSubmitEdit);
                window.removeEventListener(EVENTS.CLICK, onClickRemoveEdit);

                this.isEditable = true;
            }
        };

        const onClickDelete = () => {
            store.delete(id);

            deleteButton.removeEventListener(EVENTS.CLICK, onClickDelete);
            editButton.removeEventListener(EVENTS.CLICK, onClickEdit);
            messageArea.removeEventListener(EVENTS.KEYDOWN, onSubmitEdit);
            messagePlace.remove();
        };

        if (String(user) === USERS.FIRST) {
            messagePlace.classList.add('flex-row-reverse');
            messageBox.classList.add('after:left-full');
            buttonsContainer.classList.add(
                'right-[calc(100%-10px)]',
                'flex-row-reverse',
            );
        } else if (String(user) === USERS.SECOND) {
            messagePlace.classList.add('flex-row');
            messageBox.classList.add('after:right-full');
            buttonsContainer.classList.add(
                'left-[calc(100%-10px)]',
                'flex-row',
            );
        }

        messageSpan.innerText = message;
        messageArea.value = message;
        messageArea.setAttribute('type', 'text');

        messageBox.appendChild(buttonsContainer);

        buttonsContainer.append(editButton, deleteButton);
        messageBox.append(messageSpan, messageArea, buttonsContainer);
        messagePlace.append(messageBox);

        editButton.addEventListener(EVENTS.CLICK, onClickEdit);
        deleteButton.addEventListener(EVENTS.CLICK, onClickDelete);

        return messagePlace;
    }

    getElement() {
        return this.messageBox;
    }
}

export default MessageBox;
