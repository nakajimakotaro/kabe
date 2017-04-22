import {Shape,Rectangle,Circle,Point} from "./shape";
import _ = require('lodash');

export class Collision{
    list: {owner:Object, shape:Shape}[] = [];

    constructor() {
    }
    add(owner:Object, shape:Shape){
        this.list.push({shape: shape, owner: owner});
    }
    remove(owner:Object, shape:Shape){
        _.remove(this.list, (v)=>{
            return (
                v.owner === owner &&
                    v.shape === shape);
        });
    }
    collision(shape:Shape){
        shape.collisionList = [];
        for(let a of this.list){
            if(Collision.intersects(shape, a.shape)){
                shape.collisionList.push(a);
            }
        }
    }
    tick(){
        for(let collision of this.list){
            collision.shape.collisionList = [];
        }
        let root = new CollisionNode(this.game.level.shape.clone());
        Collision.treeGenerate(root, this.list);
    }
    class CollisionNode {
        child:CollisionNode[4] = new Array(4);
        values:{object:Object, node:CollisionNode}[] = [];
        constructor(public shape:Rectangle){
        }
        isEnd(){
            return (
                this.child[0] === undefined &&
                this.child[1] === undefined &&
                this.child[2] === undefined &&
                this.child[3] === undefined);
        }
    }
    private static treeGenerate(collisionList:Object[]){
        function positioningNode(node:CollisionNode, freeObject:Object[]){
            if(freeObject.length == 0){
                return;
            }
            node.child[0] = new CollisionNode(new Rectangle(node.shape.left(), node.shape.top(), node.shape.width / 2, node.shape.height / 2));
            node.child[1] = new CollisionNode(new Rectangle(node.shape.x,      node.shape.top(), node.shape.width / 2, node.shape.height / 2));
            node.child[2] = new CollisionNode(new Rectangle(node.shape.left(), node.shape.y(),   node.shape.width / 2, node.shape.height / 2));
            node.child[3] = new CollisionNode(new Rectangle(node.shape.x,      node.shape.y(),   node.shape.width / 2, node.shape.height / 2));

            let nextFreeNode = [];
            for(let object of this.freeObject){
                let addCount = 0;
                for(let nodeChild of node.child){
                    if(Collision.intersects(nodeChild.shape, object)){
                        addCount++;
                        nodeChild.values.push({object:Object, node:node});
                    }
                }
                //境界線をまたいでいるオブジェクトはここで終わり
                //またいでいなければ範囲をもう一度
                if(addCount == 1){
                    nextFreeNode.push(object);
                }
                Collision.treeGenerate(nextFreeNode);
            }
        }

        positioningNode(collisionList, this.list);
    }
    private static roundTrip(collisionList:Object[]){
        for(let x = 0; x < collisionList.length; x++){
            const a = this.list[x];
            for(let y = x + 1; y < collisionList.length; y++){
                const b = this.list[y];
                if(Collision.intersects(a.shape, b.shape)){
                    a.shape.collisionList.push(b);
                    b.shape.collisionList.push(a);
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
            (a.left() < b.right() ) &&
            (a.right()  > b.left()) &&
            (a.top() < b.bottom()) &&
            (a.bottom() > b.top()));
    }
    static RectCircle(rect:Rectangle, cicle:Circle):boolean{
        //TODO angle対応
        return (
            rect.left() - cicle.r < cicle.x && rect.right()   + cicle.r > cicle.x &&
            rect.top()  - cicle.r < cicle.y && rect.bottom()  + cicle.r > cicle.y
        ) ||
        (
            Math.hypot(rect.left()  - cicle.x, rect.top()    - cicle.y) < cicle.r ||
            Math.hypot(rect.left()  - cicle.x, rect.bottom() - cicle.y) < cicle.r ||
            Math.hypot(rect.right() - cicle.x, rect.top()    - cicle.y) < cicle.r ||
            Math.hypot(rect.right() - cicle.x, rect.bottom() - cicle.y) < cicle.r
        );
    }
    static PointPoint(a:Point, b:Point):boolean{
        return a.x == b.x && a.y == b.y;
    }
    static PointRectangle(point:Point, rect:Rectangle):boolean{
        //TODO angle対応
        return (rect.left() < point.x) && (rect.right()  > point.x) && 
        (rect.top() < point.y) && (rect.bottom() > point.y); 
    }
    static PointCircle(point:Point, cicle:Circle):boolean{
        return Math.hypot(cicle.x - point.x, cicle.y - point.y) < cicle.r;
    }
}
