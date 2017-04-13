import _ = require('lodash');
import {Game} from "./script";
import {Shape} from "./shape";

export abstract class GameObject{
    abstract game:Game;
    constructor(){
    }
    update(){
    }
    remove(){
        this.game.level.removeQueue(this);
    }

}
