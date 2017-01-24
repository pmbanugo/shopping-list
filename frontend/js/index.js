requirejs(["item"], function(Item) {
    "use strict";
      var template = document.querySelector('#item-row').innerHTML;       

      function getIndexTemplate(){
          var template = document.querySelector('#item-row').innerHTML;
          return template;
      }  

      function saveNewitem(){
          var itemNameInput = document.getElementById("new-item-name");
          var itemName = itemNameInput.value;

          if(itemName){
              hoodie.store('item').add({
                    name: itemName
                }).then(function (data) {
                    var item = new Item(data.name, data.id);
                    var template = getIndexTemplate();
                    template = template.replace("{{name}}", data.name);
                    template = template.replace("{{row-id}}", data.id);
                    template = template.replace("{{item-id}}", data.id);
                    document.getElementById("item-table").tBodies[0].innerHTML +=template; 

                    console.log(data);
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

    hoodie.ready.then(function () {
        // all hoodie APIs are ready now
        document.getElementById("add-item").addEventListener("click", saveNewitem);

        window.pageEvents = {
            deleteItem: deleteItem,
            saveList: saveList
        }
    });
});