import { createElement, closeModalWindow, closeModalWindowClickOut, tableClientsClear, serverChekData } from './modules/helpers.js';
import { closeModalWinButton, addContactButton, surnameInput, nameInput, lastnameInput, primaryBtnModalWin, secondaryBtnModalWin, deleteBtnModalWin, contactInputData, phoneContactData, emailContactData, deleteBtnContact, inputWrapper, placeholderInput, errorDescription, errorMessage} from './modules/modalWindowElements.js';
import { serverAddClient, serverGetClient, serverGetClientId, serverPatchClient, serverDeleteClient } from './modules/functionAPI.js';
import { editUserBtn, deleteUserBtn } from './modules/objectsTableUsers.js';
import { sortClients, arrowChange, sortColumn } from './modules/sortSection.js';
import { filter, filterArray } from './modules/searchSection.js';

(function () {
   // Создание таблицы

    //Создаем и возвращаем строку таблицы
    function createTableLine() {
        let list = document.createElement('tr');
        list.classList.add('user-tablerow')
        return list;
    }

    // функция создания ячейки в строке
    function createTableCell(nameItem) {
        let item = document.createElement('td');
        item.textContent = nameItem;
        return item;
    }

    // функция преоборазования даты и рендеренга дат
    function dateRender(objDate, addClass, appendTo) {
        const servDate = new Date(objDate);
        let day = servDate.getDate();
        let month = servDate.getMonth() + 1;
        let year = servDate.getFullYear();
        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;


        let hour = servDate.getHours();
        let minute = servDate.getMinutes();
        if (hour < 10) hour = '0' + hour;
        if (minute < 10) minute = '0' + minute;
        let timeDate = document.createElement('div');
        timeDate.textContent = hour + ':' + minute;
        timeDate.classList.add('user-tablerow__date-time-text'); 

        let newFormatDate = document.createElement('div');
        newFormatDate.classList.add('user-tablerow__date-text')
        newFormatDate.textContent = day + '.' + month + '.' + year;

        const createDate = createTableCell();
              
        const dateWrapper = document.createElement('div');

        dateWrapper.classList.add(addClass);
        dateWrapper.append(newFormatDate);
        dateWrapper.append(timeDate);
        createDate.append(dateWrapper);
        appendTo.append(createDate);
    }

    // удаление клиента
    function deleteUser(clientId, filterFn) {
        //отрисовываем и изменяем модальное окно
        createModalWithForm('Изменить данные', serverGetClient, clientId);
        // вносим изменения
        document.getElementById('modal-body').classList.add('hide');
        document.getElementById('modal-contact').classList.add('hide');
        document.getElementById('modal-content').classList.add('modal-content-delete');
        document.getElementById('modal-header').classList.add('modal-heder-deleteWindow')
        document.getElementById('modal-close-btn').classList.add('close-btn-delete');
        document.getElementById('modal-title').textContent = 'Удалить клиента';
        document.getElementById('btn-primary').textContent = 'Удалить';
        document.getElementById('btn-delete').classList.add('hide');
        document.getElementById('btn-secondary').classList.remove('hide');
        let textClientId = document.querySelector('.modal-client-id');
        textClientId.textContent = ' ';
        let confirmDeleteDescr = document.createElement('p');
        confirmDeleteDescr.classList.add('modal-delete-descr');
        confirmDeleteDescr.textContent = 'Вы действительно хотите удалить данного клиента?';
        let parent = document.getElementById('modal-content');
        let before = document.getElementById('modal-body');
        parent.insertBefore(confirmDeleteDescr, before);
        // при подтверждении клиент удаляется, окно закрывается и всё отрисовывается
        document.getElementById('btn-primary').addEventListener('click', async function (e) {
            e.preventDefault();
            await serverDeleteClient(clientId);
            // закрываем 
            closeModalWindow();
            // очищаем таблицу
            tableClientsClear();
            // запрашиваем данные с сервера и отрисовываем  

            let clientArray = await serverChekData(serverGetClient);

            rendering(filterFn(clientArray));

        })
    }

    // Отрисовка клиентов в таблице
    async function rendering(workedArray) {

        let userTable = document.getElementById('client-table-rendering');
        let task = Array.from(workedArray);

        task.forEach(client => {
            const contactsObjArr = [{ phone: 'Телефон' }, { email: 'Email' }, { facebook: 'Facebook' }, { vk: 'VK' }, { else: 'Другое' }];
            let user = createTableLine(); // для каждого пользователя создаем свою строку
            const userId = createTableCell(`${client.id}`);
                  userId.classList.add('user-tablerow__id-text')
            const userFioItem = createTableCell(`${client.surname} ${client.name} ${client.lastName}`);
                  userFioItem.classList.add('user-tablerow__text') 
            user.append(userId, userFioItem);
            // отрисовка ячеек с датой создания и изменения
            
            dateRender(client.createdAt, 'user__date-wrapper', user);
            dateRender(client.updatedAt, 'user__date-wrapper', user);
          
                     
            // отрисовка иконок контактов 
            const clientContacts = createTableCell();
                  clientContacts.classList.add('contacts-icon');
             let contactsWrapper = document.createElement('div');
                 contactsWrapper.classList.add('contacts-wrapper');     
            let contactcIconList = document.createElement('ul');
            contactcIconList.classList.add('contact-icon__list');

            // создаем адаптивное меню контактов
            
            // подсчитываем количество необходимых для скрытия контактов
            let checkBoxLabel = document.createElement('label');
                checkBoxLabel.classList.add('checkBox-label');
                checkBoxLabel.setAttribute('for','toggle-menu');
               // если больше 4х контактов убираем скрывающий класс
                if(client.contacts.length > 4) {
                    checkBoxLabel.classList.remove('hide');
                    checkBoxLabel.textContent = ('+' + (client.contacts.length - 4)); 
                } else {
                    checkBoxLabel.classList.add('hide');
                }

                contactsWrapper.prepend(checkBoxLabel);
           
            // если у пользователя нет контактов, то ячейка все равно создается
            if (client.contacts.length < 1) {
                clientContacts.append(contactsWrapper)
                contactsWrapper.append(contactcIconList);
                user.append(clientContacts);
            }
            
            client.contacts.forEach(typeContactObj => {
                    
                    const contactItem = document.createElement('li');
                    contactItem.classList.add(('contact-icon__item-' + typeContactObj.type),'contact-icon__item');                  

                    let item = Array.from(contactsObjArr);
                    item.forEach(contact => {
                        if (typeContactObj.type === Object.keys(contact)[0]) {
                            let contactValue = Object.values(contact)[0] + ': ' + typeContactObj.value;
                            contactItem.setAttribute('data-hint', contactValue);
                        }
                    })
                    contactcIconList.append(contactItem);
                    contactsWrapper.append(contactcIconList)
                    clientContacts.append(contactsWrapper);
                    user.append(clientContacts);
                });

            const buttonCell = createTableCell();
            // обертка для кнопок  
            let buttonwrapper = document.createElement('div');
            buttonwrapper.classList.add('user__button-wrapper');
            // кнопка изменить пользователя    
            let editButton = createElement(editUserBtn, buttonwrapper);
            // кнопка удаления пользователя
            let deleteButton = createElement(deleteUserBtn, buttonwrapper);

            buttonCell.append(buttonwrapper);
            user.append(buttonCell);
            userTable.append(user);

            // вызов модального окна по нажатию на кнопку изменить клиента
            editButton.addEventListener('click', async function () {

                // получаем пользователя по id
                let clientEdit = await serverGetClientId(client.id);

                //отрисовываем и изменяем модальное окно
                let modalWin = createModalWithForm('Изменить данные', serverPatchClient, client.id);
                document.getElementById('btn-secondary').classList.add('hide');
                document.getElementById('btn-delete').classList.remove('hide');

                // присваиваем каждому инпуту значение из БД
                document.getElementById('nameInput').value = clientEdit.data.name;
                document.getElementById('surnameInput').value = clientEdit.data.surname;
                document.getElementById('lastnameInput').value = clientEdit.data.lastName;
                // получаем массив контактов из БД
                let clientEditContactsArr = clientEdit.data.contacts;
                if (clientEditContactsArr.length > 0) {
                    for (let i = 0; i < clientEditContactsArr.length; i++) {
                        document.getElementById('add-contact').click();  // создаем столько контактов сколько длинна массива                           
                        // назначаем каждому селекту соответствующий контакт
                        let selectChangeContact = document.querySelectorAll('.contact-select');
                        selectChangeContact[i].value = clientEditContactsArr[i].type;
                        // присваиваем каждому инпуту значение контакта    
                        let inputChangeContact = document.querySelectorAll('.contact__input');
                        inputChangeContact[i].value = clientEditContactsArr[i].value;
                    }
                }

                // удаление клиента из модального окна 
                modalWin.deleteBtn.addEventListener('click', function () {
                    closeModalWindow();
                    deleteUser(client.id, filterArray);
                })
            })

            // вызов модального окна по нажатию на кнопку удалить
            deleteButton.addEventListener('click', async function () {
                deleteUser(client.id, filterArray);
            })
            // при нажатии на иконку скрытых контактов, они отображаются
            // иконка преобразуется в стрелку
            checkBoxLabel.addEventListener('click', function(){
                contactcIconList.classList.toggle('contact-icon__list-wrap');
                          
               let contactArray = contactcIconList.querySelectorAll('.contact-icon__item');
               for (let i=0; i < contactArray.length; i++) {
                  if (contactArray[i].classList.contains('contact-icon__item-visible') === false) {
                        checkBoxLabel.textContent = '<';
                        checkBoxLabel.classList.add('checkBox-label-visible');
                  } else {
                    checkBoxLabel.textContent = ('+' + (contactArray.length - 4)); 
                    checkBoxLabel.classList.remove('checkBox-label-visible');
                  }

                contactArray[i].classList.toggle('contact-icon__item-visible');
                
               }
            })
        })
    }

    // создание модального окна
    function createModalWithForm(nameModalWindow, serverApiFunction, clientId) {
        const modalWindow = document.getElementById('modal-window'); // в какой элемент помещается модальное окно
        const modalOverlay = document.getElementById('modal-overlay');
        //header модального окна   
        let modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        modalHeader.id = 'modal-header';
        let modalTitleWrapper = document.createElement('div');
        let modalTitle = document.createElement('h5');
        modalTitle.classList.add('modal-title');
        modalTitle.id = 'modal-title';
        modalTitle.textContent = nameModalWindow;
        let modalClientId = document.createElement('p');
            modalClientId.classList.add('modal-client-id');
            modalClientId.textContent = 'ID:' + clientId;

        modalHeader.append(modalTitleWrapper);
        modalTitleWrapper.append(modalTitle);
        modalTitleWrapper.append(modalClientId);        
        

        // кнопка закрытия модального окна
        createElement(closeModalWinButton, modalHeader);

        //обертка всего модального окна с контентом
        let modalForm = document.createElement('form');
        modalForm.classList.add('modal-content');
        modalForm.id = 'modal-content';

        // Body с инпутами ввода ФИО клиента
        let modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        modalBody.id = 'modal-body';
        // Contact область по добавлению контактов юзера    
        let modalContact = document.createElement('div');
        modalContact.classList.add('modal-contact');
        modalContact.id = 'modal-contact'
        let modalContactInformation = document.createElement('div');
        modalContactInformation.classList.add('modal-contact-information');
        modalContactInformation.id = 'modal-select';

        modalForm.append(modalBody);
        modalForm.append(modalContact);
        modalContact.append(modalContactInformation);

        // //кнопка добавления контакта
        createElement(addContactButton, modalContact);

        // Создание формы с инпутами

        // Фамилия
        let wrapperSurname = createElement(inputWrapper, modalBody);
            createElement(surnameInput, wrapperSurname);

        let SurnameTextPlaceholder = createElement(placeholderInput, wrapperSurname);
        SurnameTextPlaceholder.textContent = 'Фамилия';

        // Имя
        let wrapperName = createElement(inputWrapper, modalBody);
        createElement(nameInput, wrapperName);
        let NameTextPlaceholder = createElement(placeholderInput, wrapperName);
        NameTextPlaceholder.textContent = 'Имя';
        // Отчество

        let wrapperLastname = createElement(inputWrapper, modalBody);
        createElement(lastnameInput, wrapperLastname);
        let LastnameTextPlaceholder = createElement(placeholderInput, wrapperLastname);
        LastnameTextPlaceholder.textContent = 'Отчество (при наличии)';

        // добавляем хедер и инпуты

        modalWindow.append(modalHeader);
        modalWindow.append(modalForm);

        // добавляем контакт по нажатию кнопки
        const contactsObjArr = [{ phone: 'Телефон' }, { email: 'Email' }, { facebook: 'Facebook' }, { vk: 'VK' }, { else: 'Другое' }]; // массив типов используемых контактов

        let addUserContact = document.getElementById('add-contact');
        addUserContact.addEventListener('click', function () {
            // Получаем массив всех селектов
            let selectAmmount = document.querySelectorAll('.contact-select');

            // если длинна массива меньше 10 создаем ещё один контакт
            if (selectAmmount.length < 10) {

                // каждый контакт будет списком содержащим селект, инпут и кнопки удалить контакт      
                let contactList = document.createElement('ul');
                contactList.classList.add('contact-list');

                let selectForm = document.createElement('select');
                selectForm.classList.add('contact-select');

                // создаем список выбора в селекте используя заранее подготовленный массив объектов
                let elementItem = document.createElement('li');
                elementItem.classList.add('contact__item');

                let task = Array.from(contactsObjArr);
                task.forEach(contact => {
                    let optionElement = document.createElement('option');
                    optionElement.setAttribute('value', Object.keys(contact)[0]);
                    optionElement.textContent = Object.values(contact)[0];
                    selectForm.append(optionElement);
                    elementItem.append(selectForm);
                    contactList.append(elementItem);
                })

                // создаем инпут для ввода значения контактов помещаем его в элемент списка
                let contactInputWrapper = document.createElement('li'); // элемент списка
                contactInputWrapper.classList.add('contact__item', );
                createElement(contactInputData, contactInputWrapper);
                contactList.append(contactInputWrapper);

                // кнопка удаления контакта
                let contactDeleteBtn = document.createElement('li');
                contactDeleteBtn.classList.add('contact__item');
                createElement(deleteBtnContact, contactDeleteBtn);
                contactList.append(contactDeleteBtn);


                let modalContact = document.getElementById('modal-select');
                modalContact.append(contactList);
                modalContact.classList.add('modal-contact-information-visible');
                selectAmmount = document.querySelectorAll('.contact-select');
                if (selectAmmount.length === 10) {
                    document.getElementById('add-contact').classList.add('btn-contact-invisible');
                }
            }
        })

        // Трансформация инпута контакта в зависимости от выбранного значения селекта
        let addContactBtn = document.getElementById('add-contact');
     
        addContactBtn.addEventListener('click', function() {
             
        let contactList = document.querySelectorAll('.contact-list');
           
             Array.prototype.map.call(contactList, function(element, index) {

                element.addEventListener('click', function() {
                    let selectValue = contactList[index].querySelector('.contact-select');
                    let contactInput = contactList[index].querySelector('.contact__input');
                     
                    // прослушиваем выбранный инпут и подставляем +7 и скобки
                    // для правильного заполнения маски если у него есть класс phone
                    function createMask () {                   
                            let keyCode;
                            function mask(event) {
                               event.keyCode && (keyCode = event.keyCode);
                                let pos = this.selectionStart;
                                if ((contactInput.classList.contains('phone') === true)) {
                                if (pos < 3) event.preventDefault();                           
                                let matrix = "+7 (___) ___ ____",
                                    i = 0,
                                    def = matrix.replace(/\D/g, ""),
                                    val = this.value.replace(/\D/g, ""),
                                    new_value = matrix.replace(/[_\d]/g, function(a) {
                                        return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                                    });
                                
                                i = new_value.indexOf("_");
                                if (i != -1) {
                                    i < 5 && (i = 3);
                                    new_value = new_value.slice(0, i)
                                }
                                let reg = matrix.substr(0, this.value.length).replace(/_+/g,
                                    function(a) {
                                        return "\\d{1," + a.length + "}"
                                    }).replace(/[+()]/g, "\\$&");
                                reg = new RegExp("^" + reg + "$");
                                if ((!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58)) this.value = new_value;
                                if ((event.type == "blur" && this.value.length < 5))  this.value = ""
                                }                   
                        }
                       
                            contactInput.addEventListener("input", mask, false);
                            contactInput.addEventListener("focus", mask, false);
                            contactInput.addEventListener("blur", mask, false);
                            contactInput.addEventListener("keydown", mask, false);
                        
                      
                        };

                    createMask();

                    function createInputContactAttr(inputObj, nameInput) {
                        Object.entries(inputObj.attr).forEach(element => {
                            nameInput.setAttribute(element[0], element[1]);
                           }); 
                     }
                        if (selectValue.value === 'phone') { 
                            createInputContactAttr(phoneContactData, contactInput);
                            contactInput.classList.add('phone');                                             
                        } else {
                            if (selectValue.value === 'email') {
                                createInputContactAttr(emailContactData, contactInput);
                                contactInput.removeAttribute('pattern');
                                contactInput.classList.remove('phone');      
                            } else {
                                if((selectValue.value === 'facebook') || (selectValue.value === 'vk') || (selectValue.value === 'else') ) {
                                    createInputContactAttr(contactInputData, contactInput);
                                    contactInput.setAttribute('placeholder', 'Введите данные')  
                                    contactInput.removeAttribute('pattern');
                                    contactInput.classList.remove('phone'); 
                               }
                            }
                        }
                })
            })
        })

        // удаление контактов в форме
        modalForm.addEventListener('click', function () {
            let elements = document.querySelectorAll('.delete-contact__button');
            Array.prototype.map.call(elements, function (element, index) {
                element.addEventListener('click', function () {

                    element.parentElement.parentElement.remove();
                    let elements = document.querySelectorAll('.delete-contact__button');
                    if (elements.length === 0) {
                        document.getElementById('modal-select').classList.remove('modal-contact-information-visible');
                    };

                    if (elements.length < 10) {
                        document.getElementById('add-contact').classList.remove('btn-contact-invisible');
                    }

                }, false)
            });
        })

        // блок с описанием ошибки
        createElement(errorDescription, modalForm);


        // Footer модального окна с кнопками сохранить и отменить
        let modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        //кнопка сохранения/удаления в модальном окне
        let primaryButton = createElement(primaryBtnModalWin, modalFooter);

        // кнопка отмены в модальном окне
        let cancelBtn = createElement(secondaryBtnModalWin, modalFooter);
        // прослушивание кнопки отмена в окне
        cancelBtn.addEventListener('click', function () {
            closeModalWindow();
        })
        // кнопка удаления в модальном окне
        let deleteBtn = createElement(deleteBtnModalWin, modalFooter);

        // прослушивание на форме модального окна

        modalForm.addEventListener('submit', async function (e) {

            e.preventDefault(); // запрещает обновлять страницу браузеру при отправке формы

            //узнаем тип и значение контакта  для добавления в объект клиента
            let contactsArr = []; // создаем массив для хранения списка контактов клиента
            // получаем значение из селекта и сохраняем в массив контактов клиента
            let selectArray = document.querySelectorAll('.contact-select');
            let inputContactArray = document.querySelectorAll('.contact__input');

            if (selectArray.length > 0) {
                for (let i = 0; i < selectArray.length; i++) {

                    let typeContact = selectArray[i].value;
                    let contactsInput = inputContactArray[i].value;

                    let contactsObj = {
                        type: typeContact,
                        value: contactsInput
                    }
                    contactsArr.push(contactsObj);
                }
            }
           

            //создаем объект клиента
            const client = {
                name: document.getElementById('nameInput').value,
                surname: document.getElementById('surnameInput').value,
                lastName: document.getElementById('lastnameInput').value,
                contacts: contactsArr // присваиваем полученный массив контактов клиенту
            };

             // сохраняем изменения на сервере
            const saveClientServer = await serverApiFunction(client, clientId);


            // Навешиваем бордер на не заполненные инпуты

            let inputsFields = document.querySelectorAll('.fields');
            for (var i = 0; i < inputsFields.length; i++) {
                if (!inputsFields[i].value) {
                inputsFields[i].classList.add('error');
                } else {
                    inputsFields[i].classList.remove('error');
                }

                // if(inputsFields[i].classList.contains('phone')){
                //     inputsFields[i].value = 123;
                //     let newArr = [];
                //     newArr = inputsFields[i].value.split('')
                //     console.log(newArr.length);

                //     if (newArr[0] == '8'){

                //        newArr.splice(0, 1, '+7');
                //        newArr.splice(1, 0, '(');
                //        newArr.splice(5, 0, ')');
                //        let valTEst = newArr.join('')
                //          console.log(valTEst);
                //         }

                //     };
                
            };

            // Отображение ошибок
            async function checkErrors(checkVariable) {
                if ((checkVariable.response.status === 200) || (checkVariable.response.status === 201)) {

                    // закрываем 
                    closeModalWindow();
                    // очищаем таблицу
                    tableClientsClear();
                    // запрашиваем данные с сервера и отрисовываем  

                let clientArray = await serverChekData(serverGetClient);

                    rendering(clientArray);

                    return saveClientServer;
                } else {
                    if (checkVariable.data.message === 'Client Not Found') {
                        document.getElementById('modal-body').classList.add('hide');
                        document.getElementById('modal-contact').classList.add('hide');
                        document.getElementById('modal-content').classList.add('modal-content-delete');
                        document.getElementById('modal-header').classList.add('modal-heder-deleteWindow')
                        document.getElementById('modal-close-btn').remove();
                        document.getElementById('modal-title').textContent = 'Что-то не так';
                        document.getElementById('btn-primary').textContent = 'Закрыть';
                        document.getElementById('btn-delete').classList.add('hide');
                        document.getElementById('btn-secondary').classList.add('hide');
                        let confirmDeleteDescr = document.createElement('p');
                        confirmDeleteDescr.classList.add('modal-delete-descr');
                        confirmDeleteDescr.textContent = 'Клиент не найден. После закрытия страница будет обновлена';
                        let parent = document.getElementById('modal-content');
                        let before = document.getElementById('modal-body');
                        parent.insertBefore(confirmDeleteDescr, before);
                        document.getElementById('btn-primary').addEventListener('click', async function () {
                            document.getElementById('modal-window').classList.remove('modal-active');
                            document.getElementById('modal-overlay').classList.remove('overlay-active');

                            tableClientsClear();

                            let clientArray = await serverChekData(serverGetClient);

                            rendering(clientArray);
                        })
                    } else {
                        document.getElementById('errors-description').innerHTML = '';
                        let errorsList = checkVariable.data.errors;
                        let errorArr = Array.from(errorsList);
                        errorArr.forEach(error => {
                            errorMessage(error.message);
                        })
                    }
                }
            }

            checkErrors(saveClientServer);

        });

        // при изменение инпута на котором была навешана ошибка
        // убираем красную подсветку
        document.getElementById('modal-content').addEventListener('click', function(){
           let allInputs = document.querySelectorAll('.fields');
           Array.prototype.map.call(allInputs, function(element, index) {
            element.addEventListener('click', function() {
                   allInputs[index].addEventListener('keydown', function(){
                    if (( allInputs[index].value.length + 1) > 0) {
                        allInputs[index].classList.remove('error');
                    };
                });                          
                
            })
            
           })
        });

        modalForm.append(modalFooter);

        modalOverlay.classList.add('overlay-active');
        modalWindow.classList.toggle('modal-active'); // делает модальное окно видимым     

        //закрытия модального кнопкой с классом close
        document.querySelectorAll('.close')
            .forEach(function (closeBtn) {
                closeBtn.addEventListener('click', function () {
                    modalWindow.innerHTML = '';
                    modalWindow.classList.remove('modal-active');
                    modalOverlay.classList.remove('overlay-active');
                });
            })

        return {
            modalHeader,
            modalForm,
            modalContact,
            modalWindow,
            modalOverlay,
            primaryButton,
            deleteBtn
        }
    }

    //Функция создания приложения
    async function createApp() {

        // Проверяем есть ли данные на сервере
        let clientArray = [];
        try {
            let serverData = await serverGetClient();

            if (serverData.data !== null) {
                clientArray = serverData.data
            }

            rendering(clientArray);

            // по нажатию на кнопку "Добавить пользователя" вызывает модальное окно и затемняет фон
            let addBtnUserTable = document.getElementById('add-btn');
            addBtnUserTable.addEventListener('click', function () {

                // строим модальное окно для нового клиента 
                createModalWithForm('Новый клиент', serverAddClient);
               let textClientId = document.querySelector('.modal-client-id');
                   textClientId.textContent = ' ';
            });

             // Раздел сортировки

            sortColumn('idSort', '.table-id', 'id', serverGetClient, tableClientsClear, rendering);
            sortColumn('FIO', '.table-fio', 'surname', serverGetClient, tableClientsClear, rendering);
            sortColumn('createDate', '.table-create-date', 'createdAt', serverGetClient, tableClientsClear, rendering);
            sortColumn('updateDate', '.table-last-change-date', 'updatedAt', serverGetClient, tableClientsClear, rendering);

            // Раздел поиска

            async function exeFilterFn() {
                tableClientsClear();
                let clientArray = [];
                let serverData = await serverGetClient();

                if (serverData.data !== null) {
                    clientArray = serverData.data
                }

                rendering(filterArray(clientArray));
            }

            let searchInput = document.getElementById('search-input');
            // запуск функции через 300мс после окончания ввода    
            let setTimeoutID;
            function startDelay() {
                clearTimeout(setTimeoutID);
                setTimeoutID = setTimeout(exeFilterFn, 300);
            }
            // прослушивание инпута поиска
            searchInput.addEventListener('input', startDelay);
            // закрытие модального окна по клику вне его
            closeModalWindowClickOut();
        } catch (err) {
            createModalWithForm('Новый клиент', serverAddClient);
            document.getElementById('modal-body').classList.add('hide');
            document.getElementById('modal-contact').classList.add('hide');
            document.getElementById('modal-content').classList.add('modal-content-delete');
            document.getElementById('modal-header').classList.add('modal-heder-deleteWindow')
            // document.getElementById('modal-close-btn').classList.add('close-btn-delete');
            document.getElementById('modal-close-btn').remove();
            document.getElementById('modal-title').textContent = 'Что-то пошло не так. Попробуйте зайти позже...';
            let btnPrimary = document.getElementById('btn-primary');
            btnPrimary.textContent = 'закрыть';
            btnPrimary.addEventListener('click', function () {
                location.reload();
            })
            document.getElementById('btn-delete').classList.add('hide');
            document.getElementById('btn-secondary').classList.add('hide');
        }
    }


    window.createApp = createApp;
})()