import Message from "./models/message.js";

const PEN_LOGO = '<i class="fa-solid fa-pen"></i>'
const TRASH_LOGO = '<i class="fa-solid fa-trash"></i>'

class MessageBox extends Message {
    constructor({ user, message }) {
        super({ user, message });
        this.messageBox = this.__init__();
        this.isEditable = true;
    }

    __init__() {
        const user = super.getUser();
        const message = super.getMessage();

        const messagePlace = document.createElement("div");
        messagePlace.classList.add(
            'w-full',
            'flex',
        );

        const messageBox = document.createElement("div");
        messageBox.classList.add(
            'group',
            'relative',
            'cursor-pointer',
            'max-w-1/2',
            'bg-primary-dirty-mid-green',
            'rounded-xl', 'px-3', 'py-1',
            'after:absolute',
            "after:content-['']",
            'after:top-full',
            'after:size-2',
            'after:bg-primary-dirty-mid-green',
            'after:rounded-full',
        );

        const messageSpan = document.createElement("span");
        messageSpan.classList.add(
            'block',
            'text-primary-milk-white',
            'break-all',
        );

        const messageArea = document.createElement("textarea");
        messageArea.classList.add(
            'border-none',
            'outline-none',
            'text-primary-milk-white',
            'break-all',
            'hidden',
            'w-full',
            'resize-none',
            'field-sizing-content'
        );

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add(
            'cursor-default',
            'absolute',
            'top-0',
            'h-full',
            'px-5',
            'hidden',
            'gap-x-3',
            'items-center',
            'group-hover:flex'
        );

        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        const buttonStyles = [
            'cursor-pointer',
            'size-8',
            'bg-primary-dirty-mid-green',
            'rounded-full',
            'flex',
            'justify-center',
            'items-center',
            'text-primary-milk-white',
            'text-sm'
        ];

        editButton.classList.add(...buttonStyles);
        deleteButton.classList.add(...buttonStyles);

        editButton.innerHTML = PEN_LOGO;
        deleteButton.innerHTML = TRASH_LOGO;

        const addEditStyles = () => {
            messageBox.classList.remove('bg-primary-dirty-mid-green', 'after:bg-primary-dirty-mid-green');
            messageBox.classList.add('bg-primary-dirty-dark-green', 'after:bg-primary-dirty-dark-green');

            messageSpan.classList.remove('block');
            messageSpan.classList.add('hidden');

            messageArea.classList.remove('hidden');
            messageArea.classList.add('block');

            editButton.classList.remove('bg-primary-dirty-mid-green');
            editButton.classList.add('bg-primary-dirty-dark-green');
        }

        const removeEditStyles = () => {
            messageBox.classList.remove('bg-primary-dirty-dark-green', 'after:bg-primary-dirty-dark-green');
            messageBox.classList.add('bg-primary-dirty-mid-green', 'after:bg-primary-dirty-mid-green');

            messageArea.classList.remove('block');
            messageArea.classList.add('hidden');

            messageSpan.classList.remove('hidden');
            messageSpan.classList.add('block');

            editButton.classList.remove('bg-primary-dirty-dark-green');
            editButton.classList.add('bg-primary-dirty-mid-green');
        }

        const onSubmitEdit = (event) => {
            if (event.key === 'Enter' && messageArea.value.trim() !== '') {
                this.edit(messageArea.value.trim());

                removeEditStyles();

                messageArea.removeEventListener('keydown', onSubmitEdit);
                messageArea.value = this.getMessage();

                messageSpan.innerText = this.getMessage();
                this.isEditable = true;
            }
        }

        const onClickEdit = () =>  {
            if (this.isEditable) {
                messageArea.value = this.getMessage();
                messageSpan.innerText = this.getMessage();

                addEditStyles();

                messageArea.focus();
                messageArea.addEventListener('keydown', onSubmitEdit);
                this.isEditable = false;
            } else {
                removeEditStyles();
                messageArea.removeEventListener('keydown', onSubmitEdit);
                this.isEditable = true;
            }
        }

        const onClickDelete = () => {
            deleteButton.removeEventListener('click', onClickDelete);
            editButton.removeEventListener('click', onClickEdit);
            messageArea.removeEventListener('keydown', onSubmitEdit);
            messagePlace.remove();
        }

        if (String(user) === 'user-1') {
            messagePlace.classList.add('flex-row-reverse');
            messageBox.classList.add('after:left-full');
            buttonsContainer.classList.add('right-[calc(100%-10px)]', 'flex-row-reverse');
        } else {
            messagePlace.classList.add('flex-row');
            messageBox.classList.add('after:right-full');
            buttonsContainer.classList.add('left-[calc(100%-10px)]', 'flex-row');
        }

        messageSpan.innerText = message;
        messageArea.value = message;
        messageArea.setAttribute("type", "text");

        messageBox.appendChild(buttonsContainer);

        buttonsContainer.append(editButton, deleteButton);
        messageBox.append(messageSpan, messageArea, buttonsContainer);
        messagePlace.append(messageBox);

        editButton.addEventListener("click", onClickEdit);
        deleteButton.addEventListener("click", onClickDelete);

        return messagePlace;
    }

    getElement() {
        return this.messageBox;
    }
}

export default MessageBox;