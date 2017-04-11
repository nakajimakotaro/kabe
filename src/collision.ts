import {Shape,Rectangle,Circle,Point} from "./shape";
import _ = require('lodash');

export class Collision{
    list:{object:Object|null, shape:Shape, collisionList:Object[]|undefined}[] = [];

    constructor() {
    }
    add(object:Object|null, shape:Shape, collisionList?:Object[]){
        this.list.push({object:object, shape:shape, collisionList:collisionList});
    }
    remove(object:Object|null, shape:Shape, collisionList?:Object[]){
        _.remove(this.list, (v)=>{
            return (
            v.object === object &&
            v.shape === shape &&
            v.collisionList === collisionList
            )
        });
    }
    collision(shape:Shape){
        let collisionList:{object:Object, shape:Shape}[] = [];
        for(let a of this.list){
            if(Collision.intersects(shape, a.shape) && a.object){
                collisionList.push({object: a.object, shape: a.shape});
            }
        }
        return collisionList;
    }
    tick(){
        for(let obj of this.list){
            if(obj.collisionList == undefined){
                continue;
            }
            obj.collisionList.length = 0;
        }
        for(let x = 0; x < this.list.length; x++){
            const a = this.list[x];
            for (let y = x + 1; y < this.list.length; y++){
                const b = this.list[y];
                if(Collision.intersects(a.shape, b.shape)){
                    if(a.collisionList && b.object){
                        a.collisionList.push(b.object);
                    }
                    if(b.collisionList && a.object){
                        b.collisionList.push(a.object);
                    }
                }
            }
        }
    }
    static intersects(a:Shape, b:Shape):boolean{
        if(a instanceof Rectangle       && b instanceof Rectangle){
            return Collision.RectRect(a, b);
        }else if(a instanceof Circle    && b instanceof Circle){
            return Collision.CircleCircle(a, b);
        }else if(a instanceof Rectangle && b instanceof Circle){
            return Collision.RectCircle(a, b);
        }else if(a instanceof Circle    && b instanceof Rectangle){
            return Collision.RectCircle(b, a);
        }else if(a instanceof Point     && b instanceof Rectangle){
            return Collision.PointRectangle(a, b);
        }else if(a instanceof Rectangle && b instanceof Point){
            return Collision.PointRectangle(b, a);
        }else if(a instanceof Point     && b instanceof Circle){
            return Collision.PointCircle(a, b);
        }else if(a instanceof Circle    && b instanceof Point){
            return Collision.PointCircle(b, a);
        }else if(a instanceof Point     && b instanceof Point){
            return Collision.PointPoint(a, b);
        }else{
            return true;
        }
    }

    static CircleCircle(a:Circle, b:Circle):boolean{
        return Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
    }
    static RectRect(a:Rectangle, b:Rectangle):boolean{
        //TODO angle対応
        return (
            (a.x < b.x + b.width ) &&
            (a.x + a.width  > b.x) &&
            (a.y < b.y + b.height) &&
            (a.y + a.height > b.y));
    }
    static RectCircle(rect:Rectangle, cicle:Circle):boolean{
        //TODO angle対応
        return (
            rect.x - cicle.r < cicle.x && rect.x + rect.width  + cicle.r > cicle.x &&
            rect.y - cicle.r < cicle.y && rect.y + rect.height + cicle.r > cicle.y
        ) || 
        (
            Math.hypot(rect.x -              cicle.x, rect.y -               cicle.y) < cicle.r ||
            Math.hypot(rect.x + rect.width - cicle.x, rect.y -               cicle.y) < cicle.r ||
            Math.hypot(rect.x + rect.width - cicle.x, rect.y + rect.height - cicle.y) < cicle.r ||
            Math.hypot(rect.x -              cicle.x, rect.y + rect.height - cicle.y) < cicle.r
        );
    }
    static PointPoint(a:Point, b:Point):boolean{
        return a.x == b.x && a.y == b.y;
    }
    static PointRectangle(point:Point, rect:Rectangle):boolean{
        //TODO angle対応
        return (rect.x < point.x) && (rect.x + rect.width  > point.x) && 
        (rect.y < point.y) && (rect.y + rect.height > point.y); 
    }
    static PointCircle(point:Point, cicle:Circle):boolean{
        return Math.hypot(cicle.x - point.x, cicle.y - point.y) < cicle.r;
    }
}
