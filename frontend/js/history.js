requirejs(["item"], function(Item) {
    "use strict";

    function getIndexTemplate(){
          var template = document.querySelector('#list').innerHTML;
          return template;
      } 

    hoodie.ready.then(function () {
        // all hoodie APIs are ready now

        hoodie.store('list').findAll().then(function (listCollection){
            for(var list of listCollection){
                var template = getIndexTemplate();
                template = template.replace("{{date}}", new Date(list.createdAt).toDateString());
                template = template.replace("{{cost}}", list.cost);
                document.getElementById("list-history").innerHTML +=template; 
            }            
        });
    });
});