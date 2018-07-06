(function (me) {
    me.levelListHolder = document.getElementById('levelList');
    me.levelViewHolder = document.getElementById('levelView');

    me.init = function () {
        console.log('init');
        me.getLevelList();
    };

    me.getLevelList = function () {
        console.log('getLevelList');
        fetch('data/levels.json')
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.error('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    response.json().then(me.parseLevelList);
                }
            )
            .catch(function(err) {
                console.error('Fetch Error :-S', err);
            });
    };

    me.parseLevelList = function (data) {
        console.log('parseLevelList');

        data.forEach(function (level) {
            var listItem = document.createElement('li');
            listItem.classList.add('sign');

            var listItemImage = document.createElement('img');
            listItemImage.src = level.icon;
            listItem.appendChild(listItemImage);

            var listItemTitle = document.createElement('h2');
            listItemTitle.textContent = level.name;
            listItem.appendChild(listItemTitle);

            var listItemDescription = document.createElement('p');
            listItemDescription.textContent = level.description;
            listItem.appendChild(listItemDescription);

            listItem.addEventListener('click', me.loadLevelData.bind(me, level.data));

            me.levelListHolder.appendChild(listItem);
        });

        me.levelListHolder.classList.add('active-panel');
    };

    me.loadLevelData = function (dataPath) {
        console.log('loadLevelData');
        fetch(dataPath)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.error('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    response.json().then(me.parseLevelData);
                }
            )
            .catch(function(err) {
                console.error('Fetch Error :-S', err);
            });
    };

    me.parseLevelData = function (data) {
        console.log('parseLevelData');

        data.puzzles.forEach(function (puzzle) {
            var listItem = document.createElement('li');
            listItem.classList.add('sign');

            // var listItemImage = document.createElement('img');
            // listItemImage.src = level.icon;
            // listItem.appendChild(listItemImage);

            // var listItemTitle = document.createElement('h2');
            // listItemTitle.textContent = level.name;
            // listItem.appendChild(listItemTitle);

            var listItemDescription = document.createElement('p');
            listItemDescription.textContent = JSON.stringify(puzzle);
            listItem.appendChild(listItemDescription);

            me.levelViewHolder.appendChild(listItem);
        });

        me.levelViewHolder.classList.add('active-panel');
        me.levelListHolder.classList.remove('active-panel');
    };
})(window.interst8 = window.interst8 || {});

window.interst8.init();
