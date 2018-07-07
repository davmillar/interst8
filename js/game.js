// jshint esversion:6
(function (me) {
    var levelTemplates = {
        compose: function (puzzleData) {
            return `
                Find ${puzzleData.word_clue}
                that is spelled using the abbreviations of
                ${puzzleData.states.length} states.
            `;
        },
        insert: function (puzzleData) {
            return `insert.`;
        },
        swap: function (puzzleData) {
            return `
                Find ${puzzleData.word_1_clue}
                that becomes ${puzzleData.word_2_clue}
                when you replace ${puzzleData.state_1_clue}
                with ${puzzleData.state_2_clue}.
            `;
        }
    };

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

    me.parseLevelData = function (levelData) {
        console.log('parseLevelData');

        levelData.puzzles.forEach(function (puzzle) {
            var listItem = document.createElement('li');
            listItem.classList.add('sign');

            // var listItemImage = document.createElement('img');
            // listItemImage.src = level.icon;
            // listItem.appendChild(listItemImage);

            // var listItemTitle = document.createElement('h2');
            // listItemTitle.textContent = level.name;
            // listItem.appendChild(listItemTitle);

            var listItemDescription = document.createElement('p');
            listItemDescription.textContent = levelTemplates[levelData.type](puzzle);
            listItem.appendChild(listItemDescription);

            me.levelViewHolder.appendChild(listItem);
        });

        me.levelViewHolder.classList.add('active-panel');
        me.levelListHolder.classList.remove('active-panel');
    };
})(window.interst8 = window.interst8 || {});

window.interst8.init();
