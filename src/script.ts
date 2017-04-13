import "pixi.js";
import Stats = require("stats.js");
import {Level} from "./level";
import {ResourceLoader} from "./resourceLoader";
import {LevelGenereter} from "./levelGenereter";
import {Shape} from "./shape";

export class Game{
    stats: Stats;

    resourceLoader:ResourceLoader;
    app:PIXI.Application;
    level:Level;

    constructor(){
        this.stats = new Stats();
        this.resourceLoader = new ResourceLoader();
        document.body.appendChild(this.stats.dom);

        this.app = new PIXI.Application(960, 540);
        document.body.appendChild(this.app.view);
    }
    start(){
        requestAnimationFrame(()=>{
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

        //console.time("render");
        this.app.render();
        //console.timeEnd("render");
    };
    levelChange(levelPath:string){
        LevelGenereter.loadURL(this, levelPath).then((level)=>{
            this.level = level;
            this.start();
        });
    }
}


let game = new Game();
game.levelChange("map/1.json");
