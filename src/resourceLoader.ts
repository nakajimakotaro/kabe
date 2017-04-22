import "pixi.js";
import _ = require('lodash');
import * as URI from "urijs";

export class ResourceLoader{
    ququeList:{name: string, callback: (texture:PIXI.Texture)=>void}[] = [];
    loadingList:{name: string, callback: (texture:PIXI.Texture)=>void}[] = [];
    textureList:{[key:string]: PIXI.Texture} = {};
    constructor(){
    }
    loadURL(path:string): Promise<PIXI.Texture>{
        let normalizePath = new URI(path).normalize().toString();
        return this.load(normalizePath);
    }
    load(name:string): Promise<PIXI.Texture>{
        return new Promise((resolve)=>{
            //ロードする画像をキューに追加
            this.ququeList.push({name: name, callback: (texture:PIXI.Texture)=>{
                //ロードが終了
                resolve(texture);
            }});
            this.loadStart();
        });
    }
    isCache(name:string):boolean{
        return this.textureList[name] != undefined;
    }
    private loadStart(){
        //ロード中なら何もしない
        if(this.loadingList.length != 0){
            return;
        }
        //何もロードしてなければロードを始める
        this.loadExec().then(()=>{
            for(let load of this.loadingList){
                load.callback(this.textureList[load.name]);
            }
            this.loadingList = [];
            //ロードしている間にキューが溜まっているとロードを始める
            if(this.ququeList.length != 0){
                this.loadStart();
            }
        });
    }
    setResource(name:string, resources:PIXI.Texture){
        this.textureList[name] = resources;
    }
        
    private loadExec(): Promise<{}>{
        this.loadingList = this.ququeList;
        let addList = this.ququeList;
        this.ququeList = [];
        addList = _.uniqBy(addList, 'name');
        addList = addList.filter((e)=>{
            return this.textureList[e.name] === undefined;
        });
        if(addList.length == 0){
            return new Promise((resolve)=>{
                resolve();
            });
        }

        for(let load of addList){
            PIXI.loader.add(load.name);
        }
        return new Promise((resolve, reject)=>{
            PIXI.loader.load(()=>{
                for(let load of this.loadingList){
                    this.textureList[load.name] = PIXI.loader.resources[load.name].texture;
                }
                resolve();
            });
        });
    }
}
