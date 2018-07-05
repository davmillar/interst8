(function (game) {
    /**
     * Initializes the game
     */
    game.parseLevelList = function (data) {
        console.log('parseLevelList');

        data.forEach(function (level) {
            console.log(level);
        });
    };

    game.getLevelList = function () {
        console.log('getLevelList');
        fetch('./data/levels.json')
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.error('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(game.parseLevelList);
                }
            )
            .catch(function(err) {
                console.error('Fetch Error :-S', err);
            });
    };

    game.init = function () {
        console.log('init');
        game.getLevelList();
    };
})(window.interst8 = window.interst8 || {});

window.interst8.init();
