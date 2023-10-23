// элементы модального окна
const modalWindowElements = {
    //кнопка закрытия модального окна
    closeButtonModalWin: {
        tagName: 'closeModalWinButton',
        tag: 'button',
        textContent: '',
        class: ['close-btn', 'close'],
        attr: { arialabel: 'close', type: 'button', id: 'modal-close-btn', }
    },

    //кнопка добавления контакта
    addContactButtonModalWin: {
        tagName: 'addContactButton',
        tag: 'button',
        textContent: 'Добавить контакт',
        class: ['btn-contact'],
        attr: { arialabel: 'addContact', type: 'button', id: 'add-contact' }
    },

    // Создание инпутов ФИО
    // Обертка
    wrapperInput: {
        tagName: 'wrapperInput',
        tag: 'div',
        class: ['inputbox'],
        attr: {}
    },
    // Лэйбл
    inputPlaceholder: {
        tagName: 'inputPlaceholder',
        tag: 'span',
        class: ['input-label'],
        attr: {}
    },
    // Фамилия
    surnameInputModalWin: {
        tagName: 'surnameInput',
        tag: 'input',
        textContent: '',
        class: ['form-input', 'fields'],
        attr: {placeholder: ' ', type:'text', id: 'surnameInput', minlength: '1', maxlength: '30', pattern: "^[A-Za-zА-Яа-яЁё\s]+$"}
    },

    // Имя
    nameInputModalWin: {
        tagName: 'nameInput',
        tag: 'input',
        textContent: '',
        class: ['form-input', 'fields'],
        attr: {type:'text', id: 'nameInput', placeholder: ' ', minlength: '1', maxlength: '30', pattern: "^[A-Za-zА-Яа-яЁё\s]+$"}
    },

    // Отчество
    lastnameInputModalWin: {
        tagName: 'lastnameInput',
        tag: 'input',
        textContent: '',
        class: ['form-input'],
        attr: {type:'text', id: 'lastnameInput', placeholder: ' ', minlength: '1', maxlength: '30', pattern: "^[A-Za-zА-Яа-яЁё\s]+$"}
    },

    // Блок ошибки
    descriptionError: {
        tagName: 'errorВescription',
        tag: 'div',
        class:['modal__errors-description'],
        attr:{id: 'errors-description'}
    },

    //Кнопки в футере

    //кнопка сохранения
    btnPrimaryModalWin: {
        tagName: 'primaryBtnModalWin',
        tag: 'button',
        textContent: 'Сохранить',
        class: ['btn-primary'],
        attr: { arialabel: 'save', id: 'btn-primary', type: 'submit'}
    },

    // кнопка отмены
    btnSecondaryModalWin: {
        tagName: 'secondaryBtnModalWin',
        tag: 'button',
        textContent: 'отмена',
        class: ['btn-secondary'],
        attr: { arialabel: 'cancel', type: 'button', id: 'btn-secondary' }
    },

    // кнопка удаления
    btnDeleteModalWin: {
        tagName: 'btnDeleteModalWin',
        tag: 'button',
        textContent: 'Удалить клиента',
        class: ['btn-secondary', 'hide'],
        attr: { arialabel: 'cancel', type: 'button', id: 'btn-delete' }
    },

    // инпут контактов по умолчанию
    dataContactInput: {
        tagName: 'inputData',
        tag: 'input',
        textContent: '',
        class: ['contact__input', 'phone', 'fields'],
        attr: {type:'text', placeholder: '+7 (___) ___ ____', minlength: '3', maxlength: '254'}
    },

    dataContactPhone: {
        tagName: 'inputPhone',
        tag: 'input',
        textContent: '',
        class: ['contact__input', 'fields'],
        attr: {type:'text', placeholder: '+7 (___) ___ ____', minlength: '1', maxlength: '17',pattern: "([\+]\([0-9]{1}))\[D [^0-9]]\[D [^0-9]]\[0-9]{3}\[D [^0-9]]\[D [^0-9]]\[0-9]{3}\[D [^0-9]]\[0-9]{4}"} 
    },

    dataEmailContact: {
        tagName: 'inputEmail',
        tag: 'input',
        textContent: '',
        class: ['contact__input', 'fields'],
        attr: {type:'email', placeholder: 'E-mail', minlength: '6', maxlength: '100'}
    },

     // кнопка удаления контакта
    contactDeleteBtn: {
        tagName: 'deleteBtnContact',
        tag: 'button',
        textContent: '',
        class: ['delete-contact__button'],
        attr: { arialabel: 'delete-contact', type: 'button' }
    },

    // функция передачи сообщения об ошибке
    errorMessageFunction: function(errorMessage) {
        document.getElementById('modal-contact').classList.add('modal-contact-error');
        let errorArea = document.getElementById('errors-description');
        let messageText = document.createElement('p');
            messageText.classList.add('modal__error-message-text');
            messageText.textContent =('Ошибка:' + ' ' + errorMessage);
            errorArea.append(messageText);
    }


}

export const closeModalWinButton = modalWindowElements.closeButtonModalWin;
export const addContactButton = modalWindowElements.addContactButtonModalWin;
export const surnameInput = modalWindowElements.surnameInputModalWin;
export const nameInput = modalWindowElements.nameInputModalWin;
export const lastnameInput = modalWindowElements.lastnameInputModalWin;
export const primaryBtnModalWin = modalWindowElements.btnPrimaryModalWin;
export const secondaryBtnModalWin = modalWindowElements.btnSecondaryModalWin;
export const deleteBtnModalWin = modalWindowElements.btnDeleteModalWin;

export const contactInputData = modalWindowElements.dataContactInput;
export const phoneContactData = modalWindowElements.dataContactPhone;
export const emailContactData = modalWindowElements.dataEmailContact;

export const deleteBtnContact = modalWindowElements.contactDeleteBtn;
export const inputWrapper = modalWindowElements.wrapperInput;
export const placeholderInput = modalWindowElements.inputPlaceholder;
export const errorDescription = modalWindowElements.descriptionError;
export const errorMessage = modalWindowElements.errorMessageFunction;