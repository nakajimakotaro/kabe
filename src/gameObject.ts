import _ = require('lodash');
import {Game} from "./script";
import {Shape} from "./shape";

export abstract class GameObject{
    abstract game:Game;
    id:string;
    constructor(){
        this.id = _.uniqueId();
    }
    update(){
    }
    remove(){
        this.game.level.removeQueue(this);
    }
}
