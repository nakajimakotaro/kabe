import "pixi.js";
import _ = require('lodash');
import * as URI from "urijs";

export class Loader{
    ququeList:{path: string, callback: (texture:PIXI.Texture)=>void}[] = [];
    loadingList:{path: string, callback: (texture:PIXI.Texture)=>void}[] = [];
    constructor(){
    }
    load(path:string): Promise<PIXI.Texture>{
        return new Promise((resolve)=>{
            let normalizePath = new URI(path).normalize().toString();
            //ロードする画像をキューに追加
            this.ququeList.push({path: normalizePath, callback: (texture:PIXI.Texture)=>{
                //ロードが終了
                resolve(texture);
            }});
            this.loadStart();
        });
    }
    private loadStart(){
        //ロード中なら何もしない
        if(this.loadingList.length != 0){
            return;
        }
        //何もロードしてなければロードを始める
        this.loadExec().then(()=>{
            for(let load of this.loadingList){
                load.callback(PIXI.loader.resources[load.path].texture);
            }
            this.loadingList = [];
            //ロードしている間にキューが溜まっているとロードを始める
            if(this.ququeList.length != 0){
                this.loadStart();
            }
        });
    }
    private loadExec(): Promise<{}>{
        this.loadingList = this.ququeList;
        let addList = this.ququeList;
        this.ququeList = [];
        addList = _.uniqBy(addList, 'path');
        addList = addList.filter((e)=>{
            return PIXI.loader.resources[e.path] == null;
        });
        if(addList.length == 0){
            return new Promise((resolve)=>{
                resolve();
            });
        }

        for(let load of addList){
            PIXI.loader.add(load.path);
            console.log(load.path);
        }
        return new Promise((resolve, reject)=>{
            PIXI.loader.load(()=>{
                resolve();
            });
        });
    }
}
