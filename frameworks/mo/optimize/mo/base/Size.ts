module mo{

    export class Size extends mo_base.Class{
        static __className:string = "Size";
        /**
         * Size的宽度
         * @constant {number} mo.Size#width
         */
        width : number;

        /**
         * Size的高度
         * @constant {number} mo.Size#height
         */
        height : number;

        constructor(width:number = 0, height:number = 0){
            super();
            this.width = width;
            this.height = height;
        }

        /**
         * 克隆点对象
         * @method mo.Size#clone
         * @returns {mo.Size}
         */
        public clone():Size {
            return new Size(this.width, this.height);
        }

        /**
         * 确定两个Size是否相同。如果两个Size具有相同的 width 和 height 值，则它们相同。
         * @method mo.Size#equals
         * @param {mo.Size} toCompare 要比较的Size。
         * @returns {boolean} 如果该对象与此 Point 对象相同，则为 true 值，如果不相同，则为 false。
         */
        public equals(toCompare:Size):boolean{
            return this.width == toCompare.width && this.height == toCompare.height;
        }
    }

    export function size (width:any, height?:any, resultSize?:Size):Size {
        var wValue = 0, hValue = 0, result;
        if(arguments.length == 1){
            wValue = width.width;
            hValue = width.height;
        }else if(arguments.length == 2){
            if(typeof height == "number"){
                wValue = width;
                hValue = height;
            }else{
                result = arguments[1];
                wValue = width.width;
                hValue = width.height;
            }
        }else{
            wValue = width;
            hValue = height;
        }
        result = result || new mo.Size();
        result.width = wValue;
        result.height = hValue;
        return result;
    }
}