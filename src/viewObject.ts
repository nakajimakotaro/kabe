import _ = require('lodash');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape} from "./shape";

export abstract class ViewObject extends GameObject{
    abstract shape:Shape;
    move = {x: 0, y: 0};
    moveHistory:{x: number, y: number}[]; //30フレーム前までの移動履歴

    constructor(){
        super();
        this.moveHistory = new Array(30).fill(0).map(()=>{return {x: 0, y: 0}});
    }
    update(){
        if(this.hasScreenOut()){
            this.remove();
        }
        this.moveOn();
    }
    moveOn(){
        this.shape.x += this.move.x;
        this.shape.y += this.move.y;
        this.moveHistory.shift();
        this.moveHistory.push(this.move);
        this.move = {x: 0, y: 0};
    }

    //移動履歴
    moveAverage():{x:number, y:number}{
        let moveTotal = {x: 0, y: 0};
        for(let move of this.moveHistory){
            moveTotal.x += move.x;
            moveTotal.y += move.y;
        }
        return {
            x: moveTotal.x / this.moveHistory.length,
            y: moveTotal.y / this.moveHistory.length
        };
    }
    hasScreenOut(){
        //画面からはみ出したら消す
        if(
            this.shape.x < -300 ||
            this.shape.x > 1300 ||
            this.shape.y < -300 ||
            this.shape.y > 1000){
            return true;
        }else{
            return false;
        }
    }

    remove(){
        super.remove();
        this.game.level.collision.remove(this, this.shape);
    }
}
