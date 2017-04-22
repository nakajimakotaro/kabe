export abstract class Shape{
    collisionList: {owner: Object|null, shape:Shape}[] = [];
    owner: Object|null = null;
    constructor(
        public x:number = 0,
        public y:number = 0
    ){
    }
    abstract clone():Shape;
}
export class Rectangle extends Shape{
    constructor(
        public x:number = 0,
        public y:number = 0,
        public width:number = 0,
        public height:number = 0,
        public angle:number = 0,
        public name:string = ""
    ){
        super(x, y);
    }
    left(){
        return this.x - this.width / 2;
    }
    right(){
        return this.x + this.width / 2;
    }
    top(){
        return this.y - this.height / 2;
    }
    bottom(){
        return this.y + this.height / 2;
    }
    clone():Rectangle{
        return new Rectangle(
            this.x,
            this.y,
            this.width,
            this.height,
            this.angle,
            this.name,
        );
    }
}
export class Circle extends Shape{
    constructor(
    public x:number = 0,
    public y:number = 0,
    public r:number = 0,
    public angle:number = 0,
    public name:string = ""
    ){
        super(x, y);
    }
    clone():Circle{
        return new Circle(
            this.x,
            this.y,
            this.r,
            this.angle,
            this.name,
        );
    }
}

export class Point extends Shape{
    constructor(
        public x:number = 0,
        public y:number = 0,
        public angle:number = 0,
        public name:string = ""
    ){
        super(x, y);
    }
    clone():Point{
        return new Point(
            this.x,
            this.y,
            this.angle,
            this.name,
        );
    }
}
