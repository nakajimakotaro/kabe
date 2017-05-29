import PIXI = require('pixi.js');
import Matter = require("matter-js");
import _ = require('lodash');
import {Game} from "./script";
import {GameObject} from "./gameObject";
import {Shape,Rectangle,Circle} from "./shape";
import {Wall} from "./wall"
import {Ball} from "./ball"

export class Level extends GameObject{
    matterEngine:Matter.Engine;
    width:number;
    height:number;
    view:PIXI.Graphics;

    levelData:any;
    isLoad = false;

    gameObjectList:GameObject[] = [];
    removeQueueList:GameObject[] = [];

    isGameSet = false;

    countFrame = 0;

    constructor(public game: Game){
        super();
        this.view = new PIXI.Graphics();
        this.game.app.stage.addChild(this.view);
        this.matterEngine = Matter.Engine.create();
        this.matterEngine.world.gravity.x = 0;
        this.matterEngine.world.gravity.y = 0;
        Matter.Engine.run(this.matterEngine);
        let render = Matter.Render.create({
            element: document.body,
            engine: this.matterEngine
        });
        Matter.Render.run(render)
    }
    save(){
    }
    // debugBall:Ball;
    update(){
        // if(this.debugBall == undefined){
            // this.debugBall = new Ball(this.game, new Circle(0, 0, 10), 0xff00ff);
            // this.addObject(this.debugBall);
            // //マウスとタッチイベントの追加
            // const canvas = this.game.app.view;
            // const onMove = (e)=>{
                // const x = e.pageX - canvas.offsetLeft;
                // const y = e.pageY - canvas.offsetTop;
                // let isWallHit = false;
                // for(let collision of this.debugBall.shape.collisionList){
                    // if(collision instanceof Wall){
                        // isWallHit = true;
                    // }
                // }
                // console.log(this.debugBall.shape.collisionList);
                // this.debugBall.setColor(isWallHit ? 0x00ff00 : 0xff00ff);
                // this.debugBall.shape.x = x;
                // this.debugBall.shape.y = y;
                // this.debugBall.collisionAction = ()=>{};
            // }
            // canvas.addEventListener('mousemove', onMove);
        // }

        this.view.clear();
        if(this.isGameSet == false){
            for(let object of this.gameObjectList){
                object.update();
            }
            this.removeExec();
        }
        this.countFrame++;
    }
    addObject(object:GameObject){
        this.gameObjectList.push(object);
    }

    removeQueue(object:GameObject){
        this.removeQueueList.push(object);
    }
    private removeExec(){
        for(let a of this.removeQueueList){
            _.remove(this.gameObjectList, (b)=>{
                return a===b;
            });
        }
        this.removeQueueList = [];
    }

    gameSet(){
        this.isGameSet = true;
    }
}

