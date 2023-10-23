const search = {
  // функция фильтрации
  filterFn: function (arr, prop, value) {
    let result = [];
    for (const item of arr) {
      if (String(item[prop]).includes(value) == true) result.push(item);
    }
    return result;
  },

  // создание массива отфильтрованных элементов

  filterElemArray: function (arr) {

    const searchInput = document.getElementById('search-input').value.trim();
    let serchStringArr = searchInput.split(' ');
    let filterArr = [...arr];
    let copyClientArr = [...arr];

    // в инпут поиска может быть введено любое значение
    Array.from(serchStringArr).forEach(i => {
      // поэтому поочередно проверяем
      filterArr = filter(copyClientArr, 'id', i);   // на id
      if (filterArr.length == 0) {                     // если ничего не найдено
        filterArr = filter(copyClientArr, 'surname', i); //  на  фамилию
      }
      if (filterArr.length == 0) {                      // если ничего не найдено
        filterArr = filter(copyClientArr, 'name', i)   // на имя
      };

      if (filterArr.length == 0) {                       // если ничего не найдено 
        filterArr = filter(copyClientArr, 'lastName', i) // отчество
      };
    })
    return filterArr;
  }
}

export const filter = search.filterFn;
export const filterArray = search.filterElemArray;