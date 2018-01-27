"use strict";

System.register(["shared.js"], function (_export, _context) {
  "use strict";

  var shared;


  function getIndexTemplate() {
    var template = document.querySelector("#list").innerHTML;
    return template;
  }

  function init(dataset) {
    //shared.updateDOMLoginStatus();

    dataset.getAllRecords(function (error, records) {
      if (error) {
        console.log(error);
        //notify the user
        var snackbarContainer = document.querySelector("#toast");
        snackbarContainer.MaterialSnackbar.showSnackbar({
          message: "Error getting your shopping history"
        });
      } else {
        records.forEach(function (record) {
          if (record.value) {
            var value = JSON.parse(record.value);

            var template = getIndexTemplate();
            template = template.replace("{{date}}", new Date(value.date).toLocaleString());
            template = template.replace("{{cost}}", value.cost);
            document.getElementById("list-history").innerHTML += template;
          }
        });
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

      // Initialize the Cognito Sync client
      AWS.config.credentials.get(function () {
        var syncClient = new AWS.CognitoSyncManager();

        syncClient.openOrCreateDataset("list", function (err, dataset) {
          return init(dataset);
        });
      });
    }
  };
});