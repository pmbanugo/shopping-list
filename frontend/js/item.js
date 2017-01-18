'use strict';

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