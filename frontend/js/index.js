requirejs(["item"], function(Item) {
    "use strict";
      var template = document.querySelector('#item-row').innerHTML;
      //register dialog element
      var loginDialog = document.querySelector('#login-dialog');
      dialogPolyfill.registerDialog(loginDialog);  
      var registerDialog = document.querySelector('#register-dialog');
      dialogPolyfill.registerDialog(registerDialog);        

      function getIndexTemplate(){
          var template = document.querySelector('#item-row').innerHTML;
          return template;
      }  
      
      function addItemToPage(item){
          var template = getIndexTemplate();
          template = template.replace("{{name}}", item.name);
          template = template.replace("{{row-id}}", item.id);
          template = template.replace("{{item-id}}", item.id);
          document.getElementById("item-table").tBodies[0].innerHTML +=template; 

          console.log(item);
      }

      function saveNewitem(){
          var itemNameInput = document.getElementById("new-item-name");
          var itemName = itemNameInput.value;

          if(itemName){
              hoodie.store('item').add({
                    name: itemName
                }).then(function (item) {                    
                    addItemToPage(item);
                });
          }
          itemNameInput.value = "";
      }

      function deleteRow(rowid)  
      {   
          var row = document.getElementById(rowid);
          row.parentNode.removeChild(row);
      }

      function saveList(){
            let cost = document.getElementById("cost").value;

            hoodie.store('item').findAll().then(function (items) {   
                console.log('cost = ', cost);
                console.log('items');
                for(var item of items) {
                    console.log(item);
                }

                //store the list
                hoodie.store('list').add({
                    cost: cost,
                    items: items
                });

                //delete the items
                console.log('deleting items');
                hoodie.store('item').remove(items);

                //clear the table
                document.getElementById("item-table").tBodies[0].innerHTML = "";
                document.getElementById("cost").value = "";

                //notify the user
                var snackbarContainer = document.querySelector('#toast');
                snackbarContainer.MaterialSnackbar.showSnackbar({message: 'List saved succesfully'});
            });
        };

        function deleteItem(itemId){
                console.log('removing item with id ' + itemId);
                hoodie.store('item').remove(itemId)
                    .then(function(deletedItem){
                        deleteRow(itemId);
                    });
            }

    function closeLoginDialog(){
        loginDialog.close();
    }

    function showLoginDialog(){
        loginDialog.showModal();
    }

    function closeRegisterDialog(){
        registerDialog.close();
    }

    function showRegisterDialog(){
        registerDialog.showModal();
    }

    function showAnonymous(){
        document.getElementsByClassName("login")[0].style.display = "inline";
        document.getElementsByClassName("login")[1].style.display = "inline";
        document.getElementsByClassName("register")[0].style.display = "inline";
        document.getElementsByClassName("register")[1].style.display = "inline";
        document.getElementsByClassName("logout")[0].style.display = "none";
        document.getElementsByClassName("logout")[1].style.display = "none";        
    }

    function showLoggedIn(){
        document.getElementsByClassName("login")[0].style.display = "none";
        document.getElementsByClassName("login")[1].style.display = "none";
        document.getElementsByClassName("register")[0].style.display = "none";
        document.getElementsByClassName("register")[1].style.display = "none";
        document.getElementsByClassName("logout")[0].style.display = "inline";
        document.getElementsByClassName("logout")[1].style.display = "inline";
    }

    function login(){
        var username = document.querySelector('#login-username').value;
        var password = document.querySelector('#login-password').value;

        hoodie.account.signIn({
            username: username,
            password: password
        })
        .then(function() {
            showLoggedIn();

            var snackbarContainer = document.querySelector('#toast');
            snackbarContainer.MaterialSnackbar.showSnackbar({message: 'You logged in'});
        })
        .catch(function (error){
            console.log(error);
            document.querySelector('#login-error').innerHTML = error.Error;
        });
    }

function signOut(){
    hoodie.account.signOut().then(function() {
        showAnonymous();
        var snackbarContainer = document.querySelector('#toast');
        snackbarContainer.MaterialSnackbar.showSnackbar({message: 'You logged out'});
    })
    .catch(function(){
        var snackbarContainer = document.querySelector('#toast');
        snackbarContainer.MaterialSnackbar.showSnackbar({message: 'Could not logout'});
    });
}

function register(){
    var username = document.querySelector('#register-username').value;
    var password = document.querySelector('#register-password').value;
    var options = { username: username, password: password }

    hoodie.account.signUp(options)
    .then(function (){
        return hoodie.account.signIn(options);
    })
    .then(function() {
        showLoggedIn();
    })
    .catch(function (error){
        console.log(error);
        document.querySelector('#register-error').innerHTML = error.Error;
    });
}

    hoodie.ready.then(function () {
        // all hoodie APIs are ready now
        if(hoodie.account.isSignedIn()){
            showLoggedIn();
        }
        else{
            showAnonymous();
        }

        document.getElementById("add-item").addEventListener("click", saveNewitem);

        window.pageEvents = {
            deleteItem: deleteItem,
            saveList: saveList,
            closeLogin: closeLoginDialog,
            showLogin: showLoginDialog,
            closeRegister: closeRegisterDialog,
            showRegister: showRegisterDialog,
            login: login,
            register: register
        }

        //retrieve items on the current list and display on the page
        hoodie.store('item').findAll().then(function (items){
            for(var item of items){
                addItemToPage(item);
            }            
        });
    });
});