var dingding = {
  leftKeys: [],
  rightKeys: [],
  /**
   * Initializes dingding
   * @return {undefined}
   */
  init: function () {
    console.log("dingding.init");
    var me = this;

    me.leftKeys.push(
      me.createKey("A-E", "dingding-left-1"),
      me.createKey("F-J", "dingding-left-2"),
      me.createKey("K-O", "dingding-left-3"),
      me.createKey("P-T", "dingding-left-4"),
      me.createKey("U-Z", "dingding-left-5")
    );

    me.rightKeys.push(
      me.createKey("A", "dingding-right-1"),
      me.createKey("B", "dingding-right-2"),
      me.createKey("C", "dingding-right-3"),
      me.createKey("D", "dingding-right-4"),
      me.createKey("E", "dingding-right-5"),
      me.createKey("_", "dingding-right-6")
    );

    document.body.addEventListener("touchmove", console.log, false);
  },

  /**
   * Creates a visual key element in the page
   *
   * @param  {String} display Text to display on the key element
   * @param  {String} keyClass Class to add to the key element
   *
   * @return {Element}         Key element
   */
  createKey: function (display, keyClass) {
    console.log("dingding.createKey");
    var me = this,
        keyElement;

    keyElement = document.createElement("div");
    if (keyElement.classList) {
      keyElement.classList.add("dingding-key");
      keyElement.classList.add(keyClass);
    } else {
      keyElement.className += " dingding-key " + keyClass;
    }
    keyElement.innerHTML = display;

    document.body.appendChild(keyElement);

    return keyElement;
  }
};