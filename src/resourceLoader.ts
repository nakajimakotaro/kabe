import "pixi.js";
import _ = require('lodash');
import * as URI from "urijs";

export class ResourceLoader {
    ququeList: { name: string, callback: (texture: PIXI.Texture) => void }[] = [];
    loadingList: { name: string, callback: (texture: PIXI.Texture) => void }[] = [];
    textureList: { [key: string]: PIXI.Texture } = {};
    constructor() {
    }
    loadURL(path: string): PIXI.Sprite {
        let normalizePath = new URI(path).normalize().toString();
        return this.load(normalizePath);
    }
    load(name: string): PIXI.Sprite {
        const sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        sprite.anchor = new PIXI.ObservablePoint(() => { }, null, 0.5, 0.5);
        //ロードする画像をキューに追加
        this.ququeList.push({
            name: name,
            callback: (texture: PIXI.Texture) => {
                //ロードが終了
                sprite.texture = texture;
            }
        });
        this.loadStart();

        return sprite;
    }
    circle(radius: number, color: number) {
        let key = `circle ${radius}px 0x${color.toString(16)}`;

        if (!this.textureList[key]) {
            this.textureList[key] =
                new PIXI.Graphics()
                    .beginFill(color)
                    .drawCircle(0, 0, radius)
                    .generateCanvasTexture(1);
        }
        let sprite = new PIXI.Sprite(this.textureList[key]);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        return sprite;
    }
    rectangle(width: number, height: number, color: number) {
        let key = `rectangle ${width}px ${height}px 0x${color.toString(16)}`;
        if (!this.textureList[key]) {
            this.textureList[key] =
                new PIXI.Graphics()
                    .beginFill(color)
                    .drawRect(0, 0, width, height)
                    .generateCanvasTexture(1);
        }
        let sprite = new PIXI.Sprite(this.textureList[key]);
        sprite.anchor = new PIXI.ObservablePoint(() => { }, null, 0.5, 0.5);
        return sprite;
    }
    isCache(name: string): boolean {
        return this.textureList[name] != undefined;
    }
    private loadStart() {
        //ロード中なら何もしない
        if (this.loadingList.length != 0) {
            return;
        }
        //何もロードしてなければロードを始める
        this.loadExec().then(() => {
            for (let load of this.loadingList) {
                load.callback(this.textureList[load.name]);
            }
            this.loadingList = [];
            //ロードしている間にキューが溜まっているとロードを始める
            if (this.ququeList.length != 0) {
                this.loadStart();
            }
        });
    }
    setResource(name: string, resources: PIXI.Texture) {
        this.textureList[name] = resources;
    }

    private loadExec(): Promise<{}> {
        this.loadingList = this.ququeList;
        let addList = this.ququeList;
        this.ququeList = [];
        addList = _.uniqBy(addList, 'name');
        addList = addList.filter((e) => {
            return this.textureList[e.name] === undefined;
        });
        if (addList.length == 0) {
            return new Promise((resolve) => {
                resolve();
            });
        }

        for (let load of addList) {
            PIXI.loader.add(load.name);
        }
        return new Promise((resolve, reject) => {
            PIXI.loader.load(() => {
                for (let load of this.loadingList) {
                    this.textureList[load.name] = PIXI.loader.resources[load.name].texture;
                }
                resolve();
            });
        });
    }
}
