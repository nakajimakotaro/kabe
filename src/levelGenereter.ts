import "pixi.js";
import Matter = require("matter-js");
import _ = require('lodash');
import {Level} from "./level";
import {Game} from "./script";
import {Wall} from "./wall";
import {BallTee} from "./ballTee";
import {Shape,Rectangle,Circle,Point} from "./shape";

interface IWall{
    object:"Wall";
    x:number,
    y:number,
    w:number,
    h:number,
}
function wallCreate(game:Game, wallData:IWall):Wall{
    return new Wall(
        game,
        wallData.x,
        wallData.y,
        wallData.w,
        wallData.h,
    );
}

interface IBallTee {
    object: "BallTee";
    x: number;
    y: number;
}
function BallTeeCreate(game: Game, ballTeeData: IBallTee): BallTee {
    return new BallTee(
        game,
        ballTeeData.x,
        ballTeeData.y
    );
}

interface ILevelConfig {
    width:number,
    height:number,
}

interface ILevel {
    levelConfig: ILevelConfig;
    gameObject: Array<IWall | IBallTee>;
}
function levelCreate(game: Game, levelData: ILevel): Level {
    const level = new Level(game);
    game.level = level;
    level.width = levelData.levelConfig.width;
    level.height = levelData.levelConfig.height;
    for (let gameObjectData of levelData.gameObject) {
        switch (gameObjectData.object) {
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

export class LevelGenereter {
    static loadURL(game: Game, path: string): Promise<Level> {
        return new Promise((resolve) => {
            const req = new XMLHttpRequest();
            req.open('GET', path, true);
            req.addEventListener('load', () => {
                resolve(req.responseText);
            });
            req.send(null);
        }).then((levelText: string) => {
            const level = LevelGenereter.createLevel(game, levelText);
            return Promise.resolve(level);
        });
    }
    static createLevel(game: Game, levelText: string): Level {
        const levelData = JSON.parse(levelText) as ILevel;
        return levelCreate(game, levelData);
    }
}
