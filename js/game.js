// jshint esversion:6
(function (me) {
    var levelList = document.getElementById('levelList');
    var levelView = document.getElementById('levelView');
    var levelViewWrapper = document.getElementById('levelViewWrapper');
    var aboutView = document.getElementById('aboutView');
    var backButton = document.getElementById('backBtn');
    var shareButton = document.getElementById('shareBtn');

    var levelTemplates = {
        compose: function (puzzleData) {
            return {
                question: `
                    Find ${puzzleData.word_clue}
                    that is spelled using
                    ${puzzleData.states.length} state abbreviations.
                `,
                answer: `
                    ${puzzleData.answer} (${puzzleData.states.join(', ')}).
                `
            };
        },
        insert: function (puzzleData) {
            return {
                question: `
                    Find ${puzzleData.word_1_clue}
                    that becomes ${puzzleData.word_2_clue}
                    when you insert ${puzzleData.state_clue}.
                `,
                answer: `
                    ${puzzleData.answer_1} becomes
                    ${puzzleData.answer_2}.
                `
            };
        },
        'insert-three': function (puzzleData) {
            return {
                question: `
                    Find ${puzzleData.word_1_clue}
                    that becomes ${puzzleData.word_2_clue}
                    when you insert ${puzzleData.state_1_clue},
                    and becomes ${puzzleData.word_3_clue}
                    when you insert ${puzzleData.state_2_clue}.
                `,
                answer: `
                    ${puzzleData.answer_1} becomes
                    ${puzzleData.answer_2} becomes
                    ${puzzleData.answer_3}.
                `
            };
        },
        swap: function (puzzleData) {
            return {
                question: `
                    Find ${puzzleData.word_1_clue}
                    that becomes ${puzzleData.word_2_clue}
                    when you replace ${puzzleData.state_1_clue}
                    with ${puzzleData.state_2_clue}.
                `,
                answer: `
                    ${puzzleData.answer_1} becomes
                    ${puzzleData.answer_2}.
                `
            };
        },
        double: function (puzzleData) {
            return {
                question: `
                    Find ${puzzleData.word_clue}
                    that contains ${puzzleData.state_clue} twice.
                `,
                answer: `
                    ${puzzleData.answer} (${puzzleData.state}).
                `
            };
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
        levelList.classList.add('active-panel');
        levelViewWrapper.classList.remove('active-panel');
        aboutView.classList.remove('active-panel');
        shareButton.classList.add('button-hidden');
    };

    me.showAbout = function () {
        levelList.classList.remove('active-panel');
        levelViewWrapper.classList.remove('active-panel');
        aboutView.classList.add('active-panel');
        shareButton.classList.remove('button-hidden');
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
        levelList.innerHTML = '';

        data.forEach(function (level) {
            var listItem = document.createElement('li');
            listItem.classList.add('sign', 'icon-space', 'sign--link');

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

            levelList.appendChild(listItem);
        });

        var listItem = document.createElement('li');
        listItem.classList.add('sign', 'sign--link', 'sign--blue');

        var listItemTitle = document.createElement('h2');
        listItemTitle.textContent = 'Travel Information';
        listItemTitle.classList.add('center');
        listItem.appendChild(listItemTitle);

        listItem.addEventListener('click', me.showAbout);

        levelList.appendChild(listItem);

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
        levelView.innerHTML = '';

        levelData.puzzles.forEach(function (puzzle) {
            var parsedPuzzleData = levelTemplates[levelData.type](puzzle);
            var listItem = document.createElement('li');
            listItem.classList.add('sign', 'sign--answer');

            var listItemDescription = document.createElement('p');
            listItemDescription.textContent = parsedPuzzleData.question;
            listItem.appendChild(listItemDescription);

            var listItemAnswer = document.createElement('p');
            listItemAnswer.textContent = parsedPuzzleData.answer;
            listItemAnswer.classList.add('answer', 'answer--hidden');
            listItem.appendChild(listItemAnswer);

            listItem.addEventListener('click', me.toggleAnswer.bind(me, listItemAnswer));

            levelView.appendChild(listItem);
        });

        levelViewWrapper.classList.add('active-panel');
        levelList.classList.remove('active-panel');
        aboutView.classList.remove('active-panel');
        aboutView.classList.remove('active-panel');
        shareButton.classList.remove('button-hidden');
    };

    me.toggleAnswer = function (answerHolder) {
        answerHolder.classList.toggle('answer--hidden');
    };
})(window.interst8 = window.interst8 || {});

window.interst8.init();
