
const sortSection = {
  clientSort: function (arr, prop, dir) {
    let result = arr.sort(function (a, b) {
      let dirIf = dir == false ? a[prop] < b[prop] : a[prop] > b[prop]
      if (dirIf == true) return -1;
    });
    return result;
  },

  // функция изменения положения стрелки
  changeArrow: function (sortCell) {
    let arrow = sortCell.querySelector('.arrow');
    let dir = true;
    arrow.classList.toggle('down');
    arrow.classList.toggle('up');
    arrow.classList.contains('up') == true ? dir = false : dir = true;
    return dir;
  },

  // анимация стрелки и отрисовка  таблицы при сортирвке 

  columnSortRendering: function (nameCell, searchClass, prop, getClient, clearFn, renderFn) {
    nameCell = document.querySelector(searchClass);
    nameCell.addEventListener('click', async function () {

      let serverData = await getClient();
      let clientArray = [];

      if (serverData.data !== null) {
        clientArray = serverData.data
    }
      let arr = clientArray;

      if (searchClass === '.table-fio') {
        document.querySelector('.col-text-fio-up').classList.toggle('hide');
        document.querySelector('.col-text-fio-down').classList.toggle('hide');
      }

      let dir = arrowChange(nameCell);
      sortClients(arr, prop, dir);
      clearFn('client-table-rendering');
      renderFn(arr);
    });
  },

}

export const sortClients = sortSection.clientSort;
export const arrowChange = sortSection.changeArrow;
export const sortColumn = sortSection.columnSortRendering;