"use strict";

System.register(["shared.js"], function (_export, _context) {
  "use strict";

  var shared, itemDataset, listDataset;


  function getIndexTemplate() {
    var template = document.querySelector("#item-row").innerHTML;
    return template;
  }

  function addItemToPage(key, item) {
    if (document.getElementById(item.key)) return;

    var template = getIndexTemplate();
    template = template.replace("{{name}}", item.name);
    template = template.replace("{{cost}}", item.cost);
    template = template.replace("{{quantity}}", item.quantity);
    template = template.replace("{{subTotal}}", item.subTotal);
    template = template.replace("{{row-id}}", key);
    template = template.replace("{{item-id}}", key);
    document.getElementById("item-table").tBodies[0].innerHTML += template;

    var totalCost = Number.parseFloat(document.getElementById("total-cost").value);
    document.getElementById("total-cost").value = totalCost + item.subTotal;

    console.log(item);
  }

  function saveNewitem() {
    var name = document.getElementById("new-item-name").value;
    var cost = document.getElementById("new-item-cost").value;
    var quantity = document.getElementById("new-item-quantity").value;
    var subTotal = cost * quantity;

    if (name && cost && quantity) {
      var newItem = {
        name: name,
        cost: cost,
        quantity: quantity,
        subTotal: subTotal
      };
      var key = Date.now().toString(); //non-optimal unique key

      itemDataset.put(key, JSON.stringify(newItem), function (error, record) {
        if (error) console.log(error);else {
          console.log(record);
          addItemToPage(key, newItem);
        }
      }); //check if this returns a promise

      document.getElementById("new-item-name").value = "";
      document.getElementById("new-item-cost").value = "";
      document.getElementById("new-item-quantity").value = "";
    } else {
      var snackbarContainer = document.querySelector("#toast");
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "All fields are required"
      });
    }
  }

  function deleteRow(deletedItem) {
    var row = document.getElementById(deletedItem.key);
    row.parentNode.removeChild(row);
  }

  function saveList() {
    var cost = 0.0;

    itemDataset.getAllRecords(function (error, records) {
      if (error) {
        console.log(error);
        //notify the user
        var snackbarContainer = document.querySelector("#toast");
        snackbarContainer.MaterialSnackbar.showSnackbar({
          message: error
        });
      } else {
        var date = Date.now();
        var listId = date.toString();

        records.forEach(function (record) {
          if (record.value) {
            var value = JSON.parse(record.value);
            if (!value.listId) {
              cost += value.subTotal;
              value.listId = listId;
              itemDataset.put(record.key, JSON.stringify(value), function (error, record) {
                if (error) {
                  //notify the user
                  var snackbarContainer = document.querySelector("#toast");
                  snackbarContainer.MaterialSnackbar.showSnackbar({
                    message: error
                  });
                }
              });
            }
          }
        });

        listDataset.put(listId, JSON.stringify({ cost: cost, date: date }), function (error, record) {
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
        });
      }
    });
  }

  function deleteItem(itemId) {
    console.log("removing item with id " + itemId);

    itemDataset.get(itemId, function (error, value) {
      itemDataset.remove(itemId, function (err, record) {
        console.log("successfully deleted");
        var totalCost = Number.parseFloat(document.getElementById("total-cost").value);
        document.getElementById("total-cost").value = totalCost - JSON.parse(value).subTotal;
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
    itemDataset.getAllRecords(function (error, records) {
      // console.log("getting all items");
      if (error) console.log(error);else {
        records.forEach(function (record) {
          if (record.value) {
            var value = JSON.parse(record.value);
            if (!value.listId) addItemToPage(record.key, value);
          }
        });
      }
    });
  }
  return {
    setters: [function (_sharedJs) {
      shared = _sharedJs;
    }],
    execute: function () {
      itemDataset = void 0;
      listDataset = void 0;


      // Initialize the Amazon Cognito credentials provider
      // AWS.config.region = "us-east-2"; // Region
      // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      //   IdentityPoolId: "us-east-2:aac10a79-1bf2-4d87-a7f9-d9dcc433c102"
      // });

      // Initialize the Cognito Sync client
      AWS.config.credentials.get(function () {
        var syncClient = new AWS.CognitoSyncManager();

        syncClient.openOrCreateDataset("item", function (err, dataset) {
          itemDataset = dataset;
          init();
        });

        syncClient.openOrCreateDataset("list", function (err, dataset) {
          return listDataset = dataset;
        });
      });
    }
  };
});