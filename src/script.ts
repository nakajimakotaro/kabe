import "pixi.js";
import Stats = require("stats.js");
import {Level} from "./level";
import {Loader} from "./loader";
import {Shape} from "./shape";

export class Game{
    stats: Stats;

    loader:Loader;
    app:PIXI.Application;
    graphics:PIXI.Graphics;
    level:Level;

    constructor(){
        this.stats = new Stats();
        this.loader = new Loader();
        document.body.appendChild(this.stats.dom);

        this.app = new PIXI.Application(960, 540);
        document.body.appendChild(this.app.view);

        this.graphics = new PIXI.Graphics();
        this.app.stage.addChild(this.graphics);

    }
    start(){
        requestAnimationFrame(()=>{
            console.log(103);
            this.loop();
        });
    }
    private loop(){
        requestAnimationFrame(()=>{
            this.loop();
        });
        this.stats.update();

        //console.time("update");
        this.level.update();
        //console.timeEnd("update");
        //console.time("draw");
        this.level.draw(this.graphics);
        //console.timeEnd("draw");

        //console.time("render");
        this.app.render();
        //console.timeEnd("render");
        this.graphics.clear();
    };
    levelChange(levelData:string){
        this.level = new Level(game);
        this.level.load(levelData);
    }
}


let game = new Game();
let req = new XMLHttpRequest();
req.addEventListener('load', (e)=>{
    //マップがダウンロードできたらゲームを始める
    game.levelChange(req.responseText);
    game.start();
});
req.open('GET', 'map.json', true);
req.send(null);
