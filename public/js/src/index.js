import * as shared from "shared.js";
     

function getIndexTemplate(){
    let template = document.querySelector('#item-row').innerHTML;
    return template;
}  

function addItemToPage(item){
    let template = getIndexTemplate();
    template = template.replace("{{name}}", item.name);
    template = template.replace("{{row-id}}", item.id);
    template = template.replace("{{item-id}}", item.id);
    document.getElementById("item-table").tBodies[0].innerHTML +=template; 

    console.log(item);
}

function saveNewitem(){
    let itemNameInput = document.getElementById("new-item-name");
    let itemName = itemNameInput.value;

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
    let row = document.getElementById(rowid);
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
        hoodie.store('item').remove(items)
        .then(function (){
            //clear the table
            document.getElementById("item-table").tBodies[0].innerHTML = "";
            document.getElementById("cost").value = "";

            //notify the user
            var snackbarContainer = document.querySelector('#toast');
            snackbarContainer.MaterialSnackbar.showSnackbar({message: 'List saved succesfully'});
        })
        .catch(function (error){
            //notify the user
            var snackbarContainer = document.querySelector('#toast');
            snackbarContainer.MaterialSnackbar.showSnackbar({message: error.message});
        });
    });
};

function deleteItem(itemId){
    console.log('removing item with id ' + itemId);
    hoodie.store('item').remove(itemId)
        .then(function(deletedItem){
            deleteRow(itemId);
    });
}

hoodie.ready.then(function () {
    // all hoodie APIs are ready now
    shared.updateDOMLoginStatus();

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
    }

    //retrieve items on the current list and display on the page
    hoodie.store('item').findAll().then(function (items){
        for(let item of items){
            addItemToPage(item);
        }            
    });
});
