export class Shape{
    collisionList: {owner: Object|null, shape:Shape}[] = [];
    owner: Object|null = null;
    constructor(
        public x:number = 0,
        public y:number = 0
    ){
    }
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
}
