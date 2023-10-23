const SERVER_URL = 'http://localhost:3000';
const serverApiFunction = {
    //добавления клиента на сервер
    addClient: async function (obj) {
            let response = await fetch(SERVER_URL + '/api/clients', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(obj),
            })
            let data = await response.json()

            return {
                data,
                response
            };
  
    },
    // Функция запроса данных  с сервера
    getClient: async function() {
        let response = await fetch(SERVER_URL + '/api/clients', {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
        let data = await response.json();

        return {
            data,
            response
        };
        

    },
   // Получить клиента по его id с сервера
    getClientId: async function(id) {
        let response = await fetch(SERVER_URL + `/api/clients/${id}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
        let data = await response.json();

        return {
            data,
            response
        };
    },
    // Внести изменения клиента по его id на сервере
    patchclient: async function(obj, id) {
        let response = await fetch(SERVER_URL + `/api/clients/${id}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj),
        })
        let data = await response.json()

        return {
            data,
            response
        };
    },
    // Удалить клиента с сервера
    deleteClient: async function(id) {
        let response = await fetch(SERVER_URL + `/api/clients/${id}`, {
            method: "DELETE",
        })
        let data = await response.json();

        return {
            data,
            response
        };
    }
}

export const serverAddClient = serverApiFunction.addClient;
export const serverGetClient = serverApiFunction.getClient;
export const serverGetClientId = serverApiFunction.getClientId;
export const serverPatchClient = serverApiFunction.patchclient;
export const serverDeleteClient = serverApiFunction.deleteClient;
