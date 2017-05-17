import { Shape, Rectangle, Circle, Point } from "./shape";
import _ = require('lodash');
import { Game } from "./script";

class CollisionAreaNode {
    child: CollisionAreaNode[] = new Array(4);
    inObject: { object: CollisionObject, areaNode: CollisionAreaNode }[] = [];
    constructor(public index: number, public shape: Rectangle) {
    }
    isEnd() {
        return (
            this.child[0] === undefined &&
            this.child[1] === undefined &&
            this.child[2] === undefined &&
            this.child[3] === undefined);
    }
}
interface CollisionObject {
    owner: Object;
    shape: Shape;
}
export class Collision {
    list: CollisionObject[] = [];

    constructor(public game: Game) {
    }
    add(owner: Object, shape: Shape) {
        this.list.push({ shape: shape, owner: owner });
    }
    remove(owner: Object, shape: Shape) {
        _.remove(this.list, (v) => {
            return (
                v.owner === owner &&
                v.shape === shape);
        });
    }
    collision(shape: Shape) {
        shape.collisionList = [];
        for (let a of this.list) {
            if (Collision.intersects(shape, a.shape)) {
                shape.collisionList.push(a);
            }
        }
    }
    tick() {
        for (let collision of this.list) {
            collision.shape.collisionList = [];
        }
        let root = new CollisionAreaNode(0, this.game.level.shape.clone());
        Collision.treeGenerate(root, this.list, 20, this.game);
        Collision.treeProcess(root);

        for (let collision of this.list) {
            collision.shape.collisionList = _.uniq(collision.shape.collisionList);
        }
    }
    private static treeProcess(tree: CollisionAreaNode, collisionStack: CollisionObject[] = []) {
        if (tree.isEnd()) {
            return;
        }

        for (let node of tree.child) {
            Collision.roundTrip(node.inObject.map((e) => e.object));
            Collision.roundTrip2(collisionStack, node.inObject.map((e) => e.object));
        }
        for (let node of tree.child) {
            collisionStack = collisionStack.concat(node.inObject.map((e) => e.object));
        }
        for (let node of tree.child) {
            Collision.treeProcess(node, collisionStack);
        }
        for (let node of tree.child) {
            collisionStack.length = collisionStack.length - node.inObject.length;
        }
    }
    private static treeGenerate(root: CollisionAreaNode, list: CollisionObject[], count: number, game: Game) {
        if (count == 0) {
            return;
        }
        let areaNode = root;
        areaNode.child[0] = new CollisionAreaNode(1,
            new Rectangle(
                areaNode.shape.left() + (areaNode.shape.width / 4),
                areaNode.shape.top() + (areaNode.shape.height / 4),
                areaNode.shape.width / 2,
                areaNode.shape.height / 2));
        areaNode.child[1] = new CollisionAreaNode(2,
            new Rectangle(
                areaNode.shape.x + (areaNode.shape.width / 4),
                areaNode.shape.top() + (areaNode.shape.height / 4),
                areaNode.shape.width / 2,
                areaNode.shape.height / 2));
        areaNode.child[2] = new CollisionAreaNode(3,
            new Rectangle(
                areaNode.shape.left() + (areaNode.shape.width / 4),
                areaNode.shape.y + (areaNode.shape.height / 4),
                areaNode.shape.width / 2,
                areaNode.shape.height / 2));
        areaNode.child[3] = new CollisionAreaNode(4,
            new Rectangle(
                areaNode.shape.x + (areaNode.shape.width / 4),
                areaNode.shape.y + (areaNode.shape.height / 4),
                areaNode.shape.width / 2,
                areaNode.shape.height / 2));
        let debug = true;
        if (debug) {
            let color = [0xf44336, 0xE91E63, 0x9C27B0, 0x673AB7, 0x3F51B5, 0x2196F3, 0x03A9F4, 0x00BCD4, 0x009688, 0x4CAF50, 0x8BC34A, 0xCDDC39, 0xFFEB3B, 0xFFC107, 0xFF9800, 0xFF5722];
            let count = 0;
            for (let areaNodeChild of areaNode.child) {
                count++;
                if (count == color.length) {
                    count = 0;
                }
                game.level.view
                    .beginFill(color[count], 0.3)
                    .drawRect(areaNodeChild.shape.left(), areaNodeChild.shape.top(), areaNodeChild.shape.width, areaNodeChild.shape.height)
                    .endFill();
                count++;
            }
        }
        let nextNodeChild = new Map<CollisionAreaNode, CollisionObject[]>();
        nextNodeChild.set(areaNode.child[0], []);
        nextNodeChild.set(areaNode.child[1], []);
        nextNodeChild.set(areaNode.child[2], []);
        nextNodeChild.set(areaNode.child[3], []);
        for (let object of list) {
            let onlyInNode: CollisionAreaNode | null = null;
            for (let areaNodeChild of areaNode.child) {
                if (Collision.intersects(areaNodeChild.shape, object.shape)) {
                    if (onlyInNode == null) {
                        onlyInNode = areaNodeChild;
                    } else {
                        onlyInNode = null;
                        areaNodeChild.inObject.push({ object: object, areaNode: areaNodeChild });
                        break;
                    }
                }
            }
            if (onlyInNode != null) {
                nextNodeChild.get(onlyInNode)!.push(object);
            }
        }
        for (let [areaNode, objectList] of nextNodeChild) {
            if (objectList.length != 0) {
                Collision.treeGenerate(areaNode, objectList, count - 1, game);
            }
        }

        //再帰呼出し
        return areaNode;
    }
    // private static treeGenerate(root:CollisionAreaNode, list:CollisionObject[]){
    // if(freeObject.length == 0){
    // return;
    // }
    // areaNode.child[0] = new CollisionAreaNode(0, new Rectangle(areaNode.shape.left(), areaNode.shape.top(), areaNode.shape.width / 2, areaNode.shape.height / 2));
    // areaNode.child[1] = new CollisionAreaNode(1, new Rectangle(areaNode.shape.x,      areaNode.shape.top(), areaNode.shape.width / 2, areaNode.shape.height / 2));
    // areaNode.child[2] = new CollisionAreaNode(2, new Rectangle(areaNode.shape.left(), areaNode.shape.y,   areaNode.shape.width / 2, areaNode.shape.height / 2));
    // areaNode.child[3] = new CollisionAreaNode(3, new Rectangle(areaNode.shape.x,      areaNode.shape.y,   areaNode.shape.width / 2, areaNode.shape.height / 2));

    // //境界線をまたいでいるオブジェクトはここで終わり
    // //またいでいなければ範囲をもう一度
    // let nextFreeObjectMap = new Map<0|1|2|3, CollisionObject[]>();
    // nextFreeObjectMap.set(0, []);
    // nextFreeObjectMap.set(1, []);
    // nextFreeObjectMap.set(2, []);
    // nextFreeObjectMap.set(3, []);
    // for(let object of freeObject){
    // for(let i = 0; i < 4; i++){
    // let areaNodeChild = areaNode.child[i];
    // if(Collision.intersects(areaNodeChild.shape, object.shape)){
    // areaNodeChild.inObject.push({object: object, areaNode: areaNodeChild});
    // nextFreeObjectMap.get(i as 0|1|2|3)!.push(object);
    // }
    // }
    // }
    // for(let i = 0; i < 4; i++){
    // let areaNodeChild = areaNode.child[i];
    // let nextFreeObjectList = nextFreeObjectMap.get(i as 0|1|2|3)!;
    // positioningNode(areaNodeChild, nextFreeObjectList);
    // }
    // positioningNode(root, list);
    // }
    //総当り
    private static roundTrip(collisionList: CollisionObject[]) {
        if (!Array.isArray(collisionList)){
            return;
        }
        for (let x = 0; x < collisionList.length; x++) {
            const a = collisionList[x];
            for (let y = x + 1; y < collisionList.length; y++) {
                const b = collisionList[y];
                if (Collision.intersects(a.shape, b.shape)) {
                    a.shape.collisionList.push(b);
                    b.shape.collisionList.push(a);
                }
            }
        }
    }
    //AとBの総当り
    //Aの要素同士では当たり判定を取らない(Bも同じ)
    private static roundTrip2(collisionListA: CollisionObject[], collisionListB: CollisionObject[]) {
        if (!Array.isArray(collisionListA) || !Array.isArray(collisionListB)){
            return;
        }
        for (let a of collisionListA) {
            for (let b of collisionListB) {
                if (Collision.intersects(a.shape, b.shape)) {
                    a.shape.collisionList.push(b);
                    b.shape.collisionList.push(a);
                }
            }
        }
    }
    static intersects(a: Shape, b: Shape): boolean {
        if (a instanceof Rectangle && b instanceof Rectangle) {
            return Collision.RectRect(a, b);
        } else if (a instanceof Circle && b instanceof Circle) {
            return Collision.CircleCircle(a, b);
        } else if (a instanceof Rectangle && b instanceof Circle) {
            return Collision.RectCircle(a, b);
        } else if (a instanceof Circle && b instanceof Rectangle) {
            return Collision.RectCircle(b, a);
        } else if (a instanceof Point && b instanceof Rectangle) {
            return Collision.PointRectangle(a, b);
        } else if (a instanceof Rectangle && b instanceof Point) {
            return Collision.PointRectangle(b, a);
        } else if (a instanceof Point && b instanceof Circle) {
            return Collision.PointCircle(a, b);
        } else if (a instanceof Circle && b instanceof Point) {
            return Collision.PointCircle(b, a);
        } else if (a instanceof Point && b instanceof Point) {
            return Collision.PointPoint(a, b);
        } else {
            return true;
        }
    }

    static CircleCircle(a: Circle, b: Circle): boolean {
        return Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
    }
    static RectRect(a: Rectangle, b: Rectangle): boolean {
        //TODO angle対応
        return (
            (a.left() < b.right()) &&
            (a.right() > b.left()) &&
            (a.top() < b.bottom()) &&
            (a.bottom() > b.top()));
    }
    static RectCircle(rect: Rectangle, cicle: Circle): boolean {
        //TODO angle対応
        return (
            rect.left() - cicle.r < cicle.x && rect.right() + cicle.r > cicle.x &&
            rect.top() - cicle.r < cicle.y && rect.bottom() + cicle.r > cicle.y
        ) ||
            (
                Math.hypot(rect.left() - cicle.x, rect.top() - cicle.y) < cicle.r ||
                Math.hypot(rect.left() - cicle.x, rect.bottom() - cicle.y) < cicle.r ||
                Math.hypot(rect.right() - cicle.x, rect.top() - cicle.y) < cicle.r ||
                Math.hypot(rect.right() - cicle.x, rect.bottom() - cicle.y) < cicle.r
            );
    }
    static PointPoint(a: Point, b: Point): boolean {
        return a.x == b.x && a.y == b.y;
    }
    static PointRectangle(point: Point, rect: Rectangle): boolean {
        //TODO angle対応
        return (rect.left() < point.x) && (rect.right() > point.x) &&
            (rect.top() < point.y) && (rect.bottom() > point.y);
    }
    static PointCircle(point: Point, cicle: Circle): boolean {
        return Math.hypot(cicle.x - point.x, cicle.y - point.y) < cicle.r;
    }
}
