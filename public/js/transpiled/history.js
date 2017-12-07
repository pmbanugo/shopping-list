"use strict";

System.register(["shared.js"], function (_export, _context) {
  "use strict";

  var shared;


  function getIndexTemplate() {
    var template = document.querySelector("#list").innerHTML;
    return template;
  }

  function init() {
    // all hoodie APIs are ready now
    shared.updateDOMLoginStatus();

    hoodie.store.withIdPrefix("list").findAll().then(function (listCollection) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = listCollection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var list = _step.value;

          var template = getIndexTemplate();
          template = template.replace("{{date}}", new Date(list.createdAt).toDateString());
          template = template.replace("{{cost}}", list.cost);
          document.getElementById("list-history").innerHTML += template;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });

    window.pageEvents = {
      closeLogin: shared.closeLoginDialog,
      showLogin: shared.showLoginDialog,
      closeRegister: shared.closeRegisterDialog,
      showRegister: shared.showRegisterDialog,
      login: shared.login,
      register: shared.register,
      signout: shared.signOut
    };
  }

  return {
    setters: [function (_sharedJs) {
      shared = _sharedJs;
    }],
    execute: function () {
      init();
    }
  };
});