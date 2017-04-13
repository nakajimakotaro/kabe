import "pixi.js";
import _ = require('lodash');
import {Level} from "./level";
import {Game} from "./script";
import {Wall} from "./wall";
import {BallTee} from "./ballTee";
import {Shape,Rectangle,Circle,Point} from "./shape";

interface IRectangle{
    type:"Rectangle";
    x:number;
    y:number;
    w:number;
    h:number;
}
function rectangleCreate(game:Game, rectangleData:IRectangle):Rectangle{
    return new Rectangle(
        rectangleData.x,
        rectangleData.y,
        rectangleData.w,
        rectangleData.h
    );
}

interface IPoint{
    type:"Point";
    x:number;
    y:number;
}
function pointCreate(game:Game, pointData:IPoint):Point{
    return new Point(
        pointData.x,
        pointData.y);
}

interface IWall{
    object:"Wall";
    shape:IRectangle;
}
function wallCreate(game:Game, wallData:IWall):Wall{
    const shape = new Rectangle(
        wallData.shape.x,
        wallData.shape.y,
        wallData.shape.w,
        wallData.shape.h
    );
    return new Wall(game, shape);
}

interface IBallTee{
    object:"BallTee";
    shape:IPoint;
}
function BallTeeCreate(game:Game, ballTeeData:IBallTee):BallTee{
    const shape = new Point(
        ballTeeData.shape.x,
        ballTeeData.shape.y
    );
    return new BallTee(game, shape);
}

interface ILevel{
    gameObject: Array<IWall|IBallTee>;
}
function levelCreate(game:Game, levelData:ILevel):Level{
    const level = new Level(game);
    game.level = level;
    for(let gameObjectData of levelData.gameObject){
        switch(gameObjectData.object){
            case "Wall":
                level.addObject(wallCreate(game, gameObjectData));
                break;
            case "BallTee":
                level.addObject(BallTeeCreate(game, gameObjectData));
                break;
        }
    }
    return level;
}

export class LevelGenereter{
    static loadURL(game:Game, path:string):Promise<Level>{
        return new Promise((resolve)=>{
            const req = new XMLHttpRequest();
            req.open('GET', path, true);
            req.addEventListener('load', ()=>{
                resolve(req.responseText);
            });
            req.send(null);
        }).then((levelText:string)=>{
            const level = LevelGenereter.createLevel(game, levelText);
            return Promise.resolve(level);
        });
    }
    static createLevel(game:Game, levelText:string):Level{
        const levelData = JSON.parse(levelText) as ILevel;
        return levelCreate(game, levelData);
    }
}
