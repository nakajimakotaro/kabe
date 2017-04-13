export class Shape{
    collisionList: {owner: Object|null, shape:Shape}[] = [];
    owner: Object|null = null;
    constructor(
        public x:number,
        public y:number
    ){
    }
}
export class Rectangle extends Shape{
    constructor(
        public x:number,
        public y:number,
        public width:number,
        public height:number,
        public angle:number = 0,
        public name:string = ""
    ){
        super(x, y);
    }
}
export class Circle extends Shape{
    constructor(
    public x:number,
    public y:number,
    public r:number,
    public angle:number = 0,
    public name:string = ""
    ){
        super(x, y);
    }
}

export class Point extends Shape{
    constructor(
        public x:number,
        public y:number,
        public angle:number = 0,
        public name:string = ""
    ){
        super(x, y);
    }
}
