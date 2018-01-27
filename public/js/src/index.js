import * as shared from "shared.js";
let itemDataset;
let listDataset;

// Initialize the Amazon Cognito credentials provider
// AWS.config.region = "us-east-2"; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: "us-east-2:aac10a79-1bf2-4d87-a7f9-d9dcc433c102"
// });

// Initialize the Cognito Sync client
AWS.config.credentials.get(function() {
  var syncClient = new AWS.CognitoSyncManager();

  syncClient.openOrCreateDataset("item", function(err, dataset) {
    itemDataset = dataset;
    init();
  });

  syncClient.openOrCreateDataset(
    "list",
    (err, dataset) => (listDataset = dataset)
  );
});

function getIndexTemplate() {
  let template = document.querySelector("#item-row").innerHTML;
  return template;
}

function addItemToPage(key, item) {
  if (document.getElementById(item.key)) return;

  let template = getIndexTemplate();
  template = template.replace("{{name}}", item.name);
  template = template.replace("{{cost}}", item.cost);
  template = template.replace("{{quantity}}", item.quantity);
  template = template.replace("{{subTotal}}", item.subTotal);
  template = template.replace("{{row-id}}", key);
  template = template.replace("{{item-id}}", key);
  document.getElementById("item-table").tBodies[0].innerHTML += template;

  let totalCost = Number.parseFloat(
    document.getElementById("total-cost").value
  );
  document.getElementById("total-cost").value = totalCost + item.subTotal;

  console.log(item);
}

function saveNewitem() {
  let name = document.getElementById("new-item-name").value;
  let cost = document.getElementById("new-item-cost").value;
  let quantity = document.getElementById("new-item-quantity").value;
  let subTotal = cost * quantity;

  if (name && cost && quantity) {
    let newItem = {
      name: name,
      cost: cost,
      quantity: quantity,
      subTotal: subTotal
    };
    let key = Date.now().toString(); //non-optimal unique key

    itemDataset.put(key, JSON.stringify(newItem), (error, record) => {
      if (error) console.log(error);
      else {
        console.log(record);
        addItemToPage(key, newItem);
      }
    }); //check if this returns a promise

    document.getElementById("new-item-name").value = "";
    document.getElementById("new-item-cost").value = "";
    document.getElementById("new-item-quantity").value = "";
  } else {
    let snackbarContainer = document.querySelector("#toast");
    snackbarContainer.MaterialSnackbar.showSnackbar({
      message: "All fields are required"
    });
  }
}

function deleteRow(deletedItem) {
  let row = document.getElementById(deletedItem.key);
  row.parentNode.removeChild(row);
}

function saveList() {
  let cost = 0.0;

  itemDataset.getAllRecords((error, records) => {
    if (error) {
      console.log(error);
      //notify the user
      var snackbarContainer = document.querySelector("#toast");
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: error
      });
    } else {
      let date = Date.now();
      let listId = date.toString();

      records.forEach(record => {
        if (record.value) {
          let value = JSON.parse(record.value);
          if (!value.listId) {
            cost += value.subTotal;
            value.listId = listId;
            itemDataset.put(
              record.key,
              JSON.stringify(value),
              (error, record) => {
                if (error) {
                  //notify the user
                  var snackbarContainer = document.querySelector("#toast");
                  snackbarContainer.MaterialSnackbar.showSnackbar({
                    message: error
                  });
                }
              }
            );
          }
        }
      });

      listDataset.put(
        listId,
        JSON.stringify({ cost, date }),
        (error, record) => {
          if (error) {
            //notify the user
            var snackbarContainer = document.querySelector("#toast");
            snackbarContainer.MaterialSnackbar.showSnackbar({
              message: error
            });
          } else {
            console.log(record);
            //clear the table
            document.getElementById("item-table").tBodies[0].innerHTML = "";
            document.getElementById("total-cost").value = "";

            //notify the user
            var snackbarContainer = document.querySelector("#toast");
            snackbarContainer.MaterialSnackbar.showSnackbar({
              message: "List saved succesfully"
            });
          }
        }
      );
    }
  });
}

function deleteItem(itemId) {
  console.log("removing item with id " + itemId);

  itemDataset.get(itemId, (error, value) => {
    itemDataset.remove(itemId, (err, record) => {
      console.log("successfully deleted");
      let totalCost = Number.parseFloat(
        document.getElementById("total-cost").value
      );
      document.getElementById("total-cost").value =
        totalCost - JSON.parse(value).subTotal;
      deleteRow(record);
    });
  });
}

function init() {
  // shared.updateDOMLoginStatus();
  // hoodie.store.withIdPrefix("item").on("add", addItemToPage);
  // hoodie.store.withIdPrefix("item").on("remove", deleteRow);

  document.getElementById("add-item").addEventListener("click", saveNewitem);

  window.pageEvents = {
    deleteItem: deleteItem,
    saveList: saveList,
    closeLogin: shared.closeLoginDialog,
    showLogin: shared.showLoginDialog,
    closeRegister: shared.closeRegisterDialog,
    showRegister: shared.showRegisterDialog,
    login: shared.login,
    register: shared.register,
    signout: shared.signOut
  };

  //retrieve items on the current list and display on the page
  itemDataset.getAllRecords((error, records) => {
    // console.log("getting all items");
    if (error) console.log(error);
    else {
      records.forEach(record => {
        if (record.value) {
          let value = JSON.parse(record.value);
          if (!value.listId) addItemToPage(record.key, value);
        }
      });
    }
  });
}
