import _ = require('lodash');
import Matter = require('matter-js');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape} from "./shape";

export abstract class ViewObject extends GameObject{
    abstract body:Matter.Body;
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
        this.body.position.x += this.move.x;
        this.body.position.y += this.move.y;
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
            this.body.position.x < -300 ||
            this.body.position.x > 1300 ||
            this.body.position.y < -300 ||
            this.body.position.y > 1000){
            return true;
        }else{
            return false;
        }
    }

    remove(){
        super.remove();
    }
}
