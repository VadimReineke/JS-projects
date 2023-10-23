const modalWindow = document.getElementById('modal-window'); // в какой элемент помещается модальное окно
const modalOverlay = document.getElementById('modal-overlay');

const helpers = {
    // функция создания любого элемента используя подготовленный объект
    elementCreate: function(obj, appendTo){
        let nameObj = obj.tagName;
        nameObj = document.createElement(obj.tag);
        nameObj.textContent = obj.textContent;
        if (obj.class.length > 0) {
            for (let i = 0; i < obj.class.length; i++) {
                nameObj.classList.add(obj.class[i]);
            }
        }
        let attrObj = Object.entries(obj.attr);
        if (attrObj.length > 0) {
            for (let i in attrObj) {
                nameObj.setAttribute(attrObj[i][0], attrObj[i][1]);
            }
        }
        appendTo.append(nameObj);
        return nameObj;
    },
    // убираем модальное окно
    modalWindowClose: function() {
        modalWindow.innerHTML = '';
        modalWindow.classList.remove('modal-active');
        modalOverlay.classList.remove('overlay-active');
    },
        // закрытие модального окна при нажатии вне его или esc

    outCloseModalWindow: function () {

        document.body.addEventListener('keyup', function (e) {
            var key = e.keyCode;

            if (key == 27) {
                modalWindow.innerHTML = '';
                document.querySelector('.modal-active').classList.remove('modal-active');
                document.querySelector('.overlay-active').classList.remove('overlay-active');
            };
        }, false);

        modalOverlay.addEventListener('click', function () {
            modalWindow.innerHTML = '';
            document.querySelector('.modal-active').classList.remove('modal-active');
            document.querySelector('.overlay-active').classList.remove('overlay-active');

        });
    },
    // очищаем таблицу
    clearTableClients: function() {
        // очистка таблицы
        const deleteElement = document.getElementById('client-table-rendering');
        deleteElement.innerHTML = '';
    },

    // проверка наличия данных на сервере
    // создание массива для работы
    checkServer: async function(serverGetData) {
        let userArray = [];

        let serverData = await serverGetData();
        
        if (serverData.data !== null) {
            userArray = serverData.data
        }

        return userArray;

    }
}

export const createElement = helpers.elementCreate;
export const closeModalWindow = helpers.modalWindowClose;
export const closeModalWindowClickOut = helpers.outCloseModalWindow;
export const serverChekData = helpers.checkServer;
export const tableClientsClear = helpers.clearTableClients;