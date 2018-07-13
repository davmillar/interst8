// jshint esversion:6
(function (me) {
    var levelListHolder = document.getElementById('levelList');
    var levelViewHolder = document.getElementById('levelView');
    var backButton = document.getElementById('backBtn');
    var shareButton = document.getElementById('shareBtn');

    var levelTemplates = {
        compose: function (puzzleData) {
            return `
                Find ${puzzleData.word_clue}
                that is spelled using the abbreviations of
                ${puzzleData.states.length} states.
            `;
        },
        insert: function (puzzleData) {
            return `
                Find ${puzzleData.word_1_clue}
                that becomes ${puzzleData.word_2_clue}
                when you insert ${puzzleData.state_clue}.
            `;
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

    me.init = function () {
        backButton.addEventListener('click', me.showMenu.bind(me));

        if (navigator.share) {
            shareButton.addEventListener('click', me.shareApp.bind(me));
        } else {
            shareButton.style.visibility = 'hidden';
        }

        me.getLevelList();
    };

    me.showMenu = function () {
        console.log('show');
        levelListHolder.classList.add('active-panel');
        levelViewHolder.classList.remove('active-panel');
    };

    me.shareApp = function () {
        navigator.share({
            title: 'Interst8',
            text: 'Check out Interst8, a curated collection of word puzzles using U.S. state abbreviations!',
            url: 'https://interst8.us/?utm_source=web_app_share',
        })
        .then(() => console.log('Successful share.'))
        .catch((error) => console.error('Error sharing:', error));
    };


    me.getLevelList = function () {
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
        levelListHolder.innerHTML = '';

        data.forEach(function (level) {
            var listItem = document.createElement('li');
            listItem.classList.add('sign');
            listItem.classList.add('icon-space');

            var listItemImage = document.createElement('img');
            listItemImage.src = level.icon;
            listItemImage.alt = `Level icon for ${level.name}.`;
            listItem.appendChild(listItemImage);

            var listItemTitle = document.createElement('h2');
            listItemTitle.textContent = level.name;
            listItem.appendChild(listItemTitle);

            var listItemDescription = document.createElement('p');
            listItemDescription.textContent = level.description;
            listItem.appendChild(listItemDescription);

            listItem.addEventListener('click', me.loadLevelData.bind(me, level.data));

            levelListHolder.appendChild(listItem);
        });

        // var listItem = document.createElement('li');
        // listItem.classList.add('sign');
        // listItem.classList.add('blue-sign');

        // var listItemTitle = document.createElement('h2');
        // listItemTitle.textContent = 'Travel Info';
        // listItemTitle.classList.add('center');
        // listItem.appendChild(listItemTitle);

        // levelListHolder.appendChild(listItem);

        me.showMenu();
    };

    me.loadLevelData = function (dataPath) {
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
        levelViewHolder.innerHTML = '';

        levelData.puzzles.forEach(function (puzzle) {
            var listItem = document.createElement('li');
            listItem.classList.add('sign');

            var listItemDescription = document.createElement('p');
            listItemDescription.textContent = levelTemplates[levelData.type](puzzle);
            listItem.appendChild(listItemDescription);

            levelViewHolder.appendChild(listItem);
        });

        levelViewHolder.classList.add('active-panel');
        levelListHolder.classList.remove('active-panel');
    };
})(window.interst8 = window.interst8 || {});

window.interst8.init();
