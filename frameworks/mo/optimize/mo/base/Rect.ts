module mo{
    export class Rect extends egret.Rectangle{

        /**
         * 判断是否包含一个矩形区域
         * @param rect
         * @returns {boolean}
         */
        public containsRect(rect:Rect):boolean{
            if(!rect) return false;

            var self = this;
            return !((self.x >= rect.x) || (self.y >= rect.y) ||
                ( self.x + self.width <= rect.x + rect.width) ||
                ( self.y + self.height <= rect.y + rect.height));
        }

        /**
         * 获取最大的x值
         * @returns {number}
         */
        public get maxX():number{
            return this.x + this.width;
        }

        /**
         * 获取中间的x值
         * @returns {number}
         */
        public get midX():number{
            return this.x + this.width/2;
        }

        /**
         * 获取最大的y值
         * @returns {number}
         */
        public get maxY():number{
            return this.y + this.height;
        }

        /**
         * 获取中间的y值
         * @returns {number}
         */
        public get midY():number{
            return this.y + this.height/2;
        }

        /**
         * 判断两个矩形框是否有交集
         * @param rect
         * @returns {boolean}
         */
        public overlaps(rect:Rect):boolean{
            var self = this;
            return !((self.x + self.width < rect.x) ||
                (rect.x + rect.width < self.x) ||
                (self.y + self.height < rect.y) ||
                (rect.y + rect.height < self.y));
        }

        /**
         * 和矩形框求并集。
         * @param rect
         * @returns {mo.Rect}
         */
        public union(rect:Rect):Rect{
            var self = this;
            var rect = mo.rect(0, 0, 0, 0);
            rect.x = Math.min(self.x, rect.x);
            rect.y = Math.min(self.y, rect.y);
            rect.width = Math.max(self.x + self.width, rect.x + rect.width) - rect.x;
            rect.height = Math.max(self.y + self.height, rect.y + rect.height) - rect.y;
            return rect;
        }

        public getIntersection(rect:Rect):Rect{
            var self = this;
            var intersection = mo.rect(
                Math.max(self.x, rect.x),
                Math.max(self.y, rect.y),
                0, 0);

            intersection.width = Math.min(self.maxX, rect.maxX) - intersection.x;
            intersection.height = Math.min(self.maxY, rect.maxY) - intersection.y;
            return intersection;
        }

        public clone(temp?:Rect):Rect{
            var self = this;
            if(!temp){
                temp = new Rect();
            }
            temp.x = self.x;
            temp.y = self.y;
            temp.width = self.width;
            temp.height = self.height;
            return temp;
        }
    }

    export function rect (x, y, width, height, resultRect?:Rect):Rect {
        if(resultRect){
            resultRect.x = x;
            resultRect.y = y;
            resultRect.width = width;
            resultRect.height = height;
            return resultRect;
        }
        return new Rect(x, y, width, height);
    }
}