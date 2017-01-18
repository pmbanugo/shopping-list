requirejs(["item"], function(Item) {
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
               let item = new Item(data.name, data.id);
               var template = getIndexTemplate();
               template = template.replace("{{name}}", data.name);
               template = template.replace("{{id}}", data.id);
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

    hoodie.ready.then(function () {
        // all hoodie APIs are ready now
        document.getElementById("add-item").addEventListener("click", function(){
            saveNewitem();
        });
    });

    window.pageEvents = {
        deleteItem: function(itemId){
            console.log('removing item with id ' + itemId);
            hoodie.store('item').remove(itemId)
                .then(function(deletedItem){
                    deleteRow(itemId);
                });
        },
        loadMore: function(){
            carService.loadMoreRequest();
        }
    }
});