// элементы таблицы пользователей
const tableUsersElements = {
    userEditBtn:  {
        tagName: 'editUserBtn',
        tag: 'button',
        textContent: 'Изменить',
        class: ['user__edit-btn', 'btn-reset'],
        attr: { arialabel: 'edit', type: 'button', id: 'user-edit' }
    },
    userDeleteBtn: {
        tagName: 'deleteUserBtn',
        tag: 'button',
        textContent: 'Удалить',
        class: ['user__delete-btn', 'btn-reset', 'delete', 'confirm'],
        attr: { arialabel: 'delete', type: 'button', id: 'user-delete', }
    }
}

export const editUserBtn = tableUsersElements.userEditBtn;
export const deleteUserBtn = tableUsersElements.userDeleteBtn;