// jshint esversion:6
(function (me) {
    const levelList = document.getElementById('levelList');
    const levelView = document.getElementById('levelView');
    const levelViewWrapper = document.getElementById('levelViewWrapper');
    const aboutView = document.getElementById('aboutView');
    const backButton = document.getElementById('backBtn');
    const shareButton = document.getElementById('shareBtn');
    
    const enumerate = str => str.replace(/[a-z]+/gi, m => m.length);

    const levelTemplates = {
        compose: function (puzzleData) {
            return {
                question: `
                    Find ${puzzleData.word_clue}
                    (${enumerate(puzzleData.answer)})
                    that is spelled using
                    ${puzzleData.states.length} state abbreviations.
                `,
                answer: `
                    ${puzzleData.answer.toUpperCase()} (${puzzleData.states.join(', ')}).
                `
            };
        },
        cryptic: function (puzzleData) {
            return {
                question: puzzleData.clue,
                answer: puzzleData.answer
            };
        },
        insert: function (puzzleData) {
            return {
                question: `
                    Find ${puzzleData.word_1_clue}
                    (${puzzleData.answer_1.length})
                    that becomes ${puzzleData.word_2_clue}
                    (${puzzleData.answer_2.length})
                    when you insert ${puzzleData.state_clue}.
                `,
                answer: `
                    ${puzzleData.answer_1.toUpperCase()} becomes
                    ${puzzleData.answer_2.toUpperCase()}.
                `
            };
        },
        'insert-three': function (puzzleData) {
            return {
                question: `
                    Find ${puzzleData.word_1_clue}
                    (${puzzleData.answer_1.length})
                    that becomes ${puzzleData.word_2_clue}
                    (${puzzleData.answer_2.length})
                    when you insert ${puzzleData.state_1_clue},
                    and becomes ${puzzleData.word_3_clue}
                    (${puzzleData.answer_3.length})
                    when you insert ${puzzleData.state_2_clue}.
                `,
                answer: `
                    ${puzzleData.answer_1.toUpperCase()} becomes
                    ${puzzleData.answer_2.toUpperCase()} becomes
                    ${puzzleData.answer_3.toUpperCase()}.
                `
            };
        },
        swap: function (puzzleData) {
            return {
                question: `
                    Find ${puzzleData.word_1_clue}
                    (${puzzleData.answer_1.length})
                    that becomes ${puzzleData.word_2_clue}
                    (${puzzleData.answer_2.length})
                    when you replace ${puzzleData.state_1_clue}
                    with ${puzzleData.state_2_clue}.
                `,
                answer: `
                    ${puzzleData.answer_1.toUpperCase()} becomes
                    ${puzzleData.answer_2.toUpperCase()}.
                `
            };
        },
        double: function (puzzleData) {
            return {
                question: `
                    Find ${puzzleData.word_clue}
                    (${puzzleData.answer.length})
                    that contains ${puzzleData.state_clue} twice.
                `,
                answer: `
                    ${puzzleData.answer.toUpperCase()} (${puzzleData.state}).
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
        backButton.classList.add('button-hidden');
    };

    me.showAbout = function () {
        levelList.classList.remove('active-panel');
        levelViewWrapper.classList.remove('active-panel');
        aboutView.classList.add('active-panel');
        backButton.classList.remove('button-hidden');
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
        backButton.classList.remove('button-hidden');
    };

    me.toggleAnswer = function (answerHolder) {
        answerHolder.classList.toggle('answer--hidden');
    };
})(window.interst8 = window.interst8 || {});

window.interst8.init();
