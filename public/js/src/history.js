import * as shared from "shared.js";

// Initialize the Amazon Cognito credentials provider
// AWS.config.region = "us-east-2"; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: "us-east-2:aac10a79-1bf2-4d87-a7f9-d9dcc433c102"
// });

// Initialize the Cognito Sync client
AWS.config.credentials.get(function() {
  var syncClient = new AWS.CognitoSyncManager();

  syncClient.openOrCreateDataset("list", (err, dataset) => init(dataset));
});

function getIndexTemplate() {
  let template = document.querySelector("#list").innerHTML;
  return template;
}

function init(dataset) {
  //shared.updateDOMLoginStatus();

  dataset.getAllRecords((error, records) => {
    if (error) {
      console.log(error);
      //notify the user
      var snackbarContainer = document.querySelector("#toast");
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Error getting your shopping history"
      });
    } else {
      records.forEach(record => {
        if (record.value) {
          let value = JSON.parse(record.value);

          let template = getIndexTemplate();
          template = template.replace(
            "{{date}}",
            new Date(value.date).toLocaleString()
          );
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
