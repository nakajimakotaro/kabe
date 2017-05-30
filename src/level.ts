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
        //canvas: document.getElementById("debug-Matter-Canvas") as HTMLCanvasElement,
        Matter.Events.on(this.matterEngine, "collisionStart", (e)=>{
            for(let pair of e.pairs){
                let bodyA = pair.bodyA["userObject"] || pair.bodyA;
                let bodyB = pair.bodyB["userObject"] || pair.bodyB;
                if(pair.bodyA["userObject"]){
                    if(pair.bodyB["userObject"]){
                        pair.bodyA["userCollisionList"].push(pair.bodyB["userObject"]);
                        pair.bodyB["userCollisionList"].push(pair.bodyA["userObject"]);
                    }else{
                        pair.bodyA["userCollisionList"].push(pair.bodyB);
                    }
                }else{
                    if(pair.bodyB["userCollisionList"]){
                        pair.bodyB["userCollisionList"].push(pair.bodyA);
                        pair.bodyB["userCollisionList"].push(pair.bodyA);
                    }
                }
            }
        });
        let canvas = document.getElementById("debug-Matter-Canvas") as HTMLCanvasElement;
        let render = Matter.Render.create({
            //element: document.body,
            canvas: canvas,
            engine: this.matterEngine
        });
        render.options.width = 100;
        render.options.height = 100;
        console.log(canvas);
        Matter.Render.run(render)
    }
    save() {
    }
    update() {
        this.view.clear();
        Matter.Engine.update(this.matterEngine);
        for (let object of this.gameObjectList) {
            object.update();
        }
        this.removeExec();
        this.countFrame++;
    }
    addObject(object: GameObject) {
        this.gameObjectList.push(object);
    }

    removeQueue(object: GameObject) {
        this.removeQueueList.push(object);
    }
    private removeExec() {
        for (let a of this.removeQueueList) {
            _.remove(this.gameObjectList, (b) => {
                return a === b;
            });
        }
        this.removeQueueList = [];
    }

    gameSet() {
        this.isGameSet = true;
    }
}

