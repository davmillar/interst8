var interst8 = {
  /**
   * Initializes the game
   * @return {undefined}
   */
  initGame: function () {
    console.log("initGame");

    dingding.init();
  }
};

$(document).on({
  'ready': interst8.initGame
});