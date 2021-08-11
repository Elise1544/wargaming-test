'use strict';

let ships;

const readTextFile = (file, callback) => {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

readTextFile('ships.json', function (text) {
  ships = JSON.parse(text);
  const allList = document.querySelector('.all-ships__list');
  const selectedList = document.querySelector('.selected-ships__list');
  const nameField = document.querySelector('#name');
  const nationField = document.querySelector('#nation');
  const typeField = document.querySelector('#type');
  const levelField = document.querySelector('#level');
  const countSpan = document.querySelector('.selected-ships__count span');

  let nationArray = [];
  let typeArray = [];
  let levelArray = [];

  const showAllShips = () => {

    for (let i = 0; i < ships.length; i++) {
      let li = document.createElement('li');
      li.classList.add('all-ships__item');
      li.innerHTML = `
        <div class="ship">
          <div class="ship-wrapper">
            <p class="ship-nation">${ships[i].nation}</p>
            <p class="ship-type">${ships[i].type}</p>
            <h3 class="ship-title">${ships[i].title}</h3>
            <p class="ship-level">${ships[i].level}</p>
          </div>
          <img class="ship-image" src="img/ship.jpg" width="300" height="150">
          <button class="ship-delete"></button>
        </div>`

      allList.append(li);
    }
  };
  showAllShips();

  const addOptions = (array, selectField, select) => {
    for (let i = 0; i < ships.length; i++) {

      if (!array.includes(ships[i][select])) {
        array.push(ships[i][select]);
        array.sort((a, b) => {
          if (a > b) {
            return 1;
          }
          if (a < b) {
            return -1;
          }
          return 0;
        });
      }
    }

    for (let i = 0; i < array.length; i++) {
      let option = document.createElement('option');
      option.value = array[i];
      option.textContent = array[i];
      selectField.append(option);
    }

  };
  addOptions(nationArray, nationField, 'nation');
  addOptions(typeArray, typeField, 'type');
  addOptions(levelArray, levelField, 'level');

  const checkShipMatch = () => {
    const allShips = [...allList.querySelectorAll('.all-ships__item')];

    allShips.forEach(ship => {
      ship.classList.add('visually-hidden');
      
      let isNameFit = () => {
        let title = ship.querySelector('.ship-title').textContent;

        if (title.indexOf(nameField.value) === 0 ||
          title.toLowerCase().indexOf(nameField.value) === 0 ||
          title.toUpperCase().indexOf(nameField.value) === 0) {

          return true;
        }
      };
      let nameFit = isNameFit();

      let isFilterFit = () => {
        if (((nationField.value === 'nation-default') || (ship.querySelector('.ship-nation').textContent === nationField.value)) &&
          ((typeField.value === 'type-default') || (ship.querySelector('.ship-type').textContent === typeField.value)) &&
          ((levelField.value === 'level-default') || (ship.querySelector('.ship-level').textContent === levelField.value))) {

          return true;
        }
      }
      let filterFit = isFilterFit();

      if (nameFit && filterFit) {
        ship.classList.remove('visually-hidden');
      }
    });
  };

  const filterShips = () => {
    const selects = document.querySelectorAll('select');

    selects.forEach(select => {
      select.addEventListener('change', () => {
        checkShipMatch();
      });
    });

  };
  filterShips();

  const findShip = () => {
    nameField.addEventListener('input', () => {
      checkShipMatch();
    });
  };
  findShip();



  const countLevels = () => {
    const levels = selectedList.querySelectorAll('.ship-level');
    let sum = 0;

    for (let i = 0; i < levels.length; i++) {
      sum += +levels[i].textContent;
    }

    countSpan.textContent = sum;
  };

  const selectShip = () => {
    const allShips = allList.querySelectorAll('[class$="-ships__item"]');

    allShips.forEach(ship => {
      ship.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('ship-delete')) {
          ship.classList.remove('selected-ships__item');
          ship.classList.add('all-ships__item');
          allList.prepend(ship);
          checkShipMatch();

        } else if (
          selectedList.querySelectorAll('.selected-ships__item').length < 7 &&
          (+countSpan.textContent + +ship.querySelector('.ship-level').textContent) <= 42) {

          ship.classList.remove('all-ships__item');
          ship.classList.add('selected-ships__item');

          setTimeout(() => {
            selectedList.append(ship);
            countLevels();
          }, 1000);

          animate({
            duration: 700,
            timing(timeFraction) {
              return timeFraction;
            },
            draw(progress) {
              ship.style.cssText = `
              position: fixed;
              left: ${progress * 100}%;
              top: 50%;

              z-index: 999;
              `;

              setTimeout(() => {
                ship.style.cssText = `
                position: inherit;
                left: 0;
                `;
              }, 700)
            }
          });

        }

        countLevels();
      });
    });
  };
  selectShip();

  function animate({ timing, draw, duration }) {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      // timeFraction изменяется от 0 до 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      // вычисление текущего состояния анимации
      let progress = timing(timeFraction);

      draw(progress); // отрисовать её

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }

    });
  }

});
