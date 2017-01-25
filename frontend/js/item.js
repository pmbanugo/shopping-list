'use strict';
//TODO: Delete file as it seems the class is not in use
define(function () {
    var Item = class {
    constructor(name, id){
        this.id = id;
        this.name = name;
        this.hasBeenBought = false;
    };

    bought(){
        this.hasBeenBought = true;
    }
}

    return Item;
});