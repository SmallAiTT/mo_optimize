module mo{
    export class Point extends egret.Point{

        /**
         * xDirty
         */
        _xDirty:boolean;
        _setXDirty(xDirty:boolean){
            if(xDirty){
                this._dirty = xDirty;
            }
            this._xDirty = xDirty;
        }
        public set xDirty(xDirty:boolean){
            this._setXDirty(xDirty);
        }
        public get xDirty():boolean{
            return this._xDirty;
        }

        /**
         * yDirty
         */
        _yDirty:boolean;
        _setYDirty(yDirty:boolean){
            if(yDirty){
                this._dirty = yDirty;
            }
            this._yDirty = yDirty;
        }
        public set yDirty(yDirty:boolean){
            this._setYDirty(yDirty);
        }
        public get yDirty():boolean{
            return this._yDirty;
        }

        /**
         * dirty
         */
        _dirty:boolean;
        _setDirty(dirty:boolean){
            this._xDirty = dirty;
            this._yDirty = dirty;
            this._dirty = dirty;
        }
        public set dirty(dirty:boolean){
            this._setDirty(dirty);
        }
        public get dirty():boolean{
            return this._dirty;
        }


        /**
         * x
         */
        _x:number;
        _setX(x:number){
            var self = this;
            if(self._x != x) {
                self._setXDirty(true);
                self._x = x;
            }
        }
        public set x(x:number){
            this._setX(x);
        }
        public get x():number{
            return this._x;
        }

        /**
         * y
         */
        _y:number;
        _setY(y:number){
            var self = this;
            if(self._y != y){
                self._setYDirty(true);
                self._y = y;
            }
        }
        public set y(y:number){
            this._setY(y);
        }
        public get y():number{
            return this._y;
        }


        public clone(point?:Point):Point{
            if(!point){
                point = new Point();
            }
            var self = this;
            point._x = self._x;
            point._y = self._y;
            point._xDirty = self._xDirty;
            point._yDirty = self._yDirty;
            point._dirty = self._dirty;
            return point;
        }

        /**
         * 返回该点的相反点
         * @returns {Point}
         */
        public neg():Point{
            return p(-this.x, -this.y);
        }

        /**
         * 加上某个点所得到的点
         * @param point
         * @returns {Point}
         */
        public add(point:Point):Point{
            return p(this.x + point.x, this.y + point.y);
        }

        /**
         * 检出某个点所得到的点
         * @param point
         * @returns {Point}
         */
        public sub(point:Point):Point{
            return p(this.x - point.x, this.y - point.y);
        }

        /**
         * 乘以一个系数所得到的点
         * @param floatVar
         * @returns {Point}
         */
        public mult(floatVar:number):Point{
            return p(this.x * floatVar, this.y * floatVar);
        }

        /**
         * 和某个点的中心点
         * @param point
         * @returns {Point}
         */
        public midPoint(point:Point):Point{
            return this.add(point).mult(0.5);
        }

        /**
         * 和某个点的点乘积
         * @param point
         * @returns {number}
         */
        public dot(point:Point):number{
            return this.x * point.x + this.y * point.y;
        }

        /**
         * 和某个点的差乘积
         * @param point
         */
        public cross(point:Point):number{
            return this.x * point.y - this.y * point.x;
        }

        /**
         * 绕着原点顺时针旋转90°后得到的点。
         * @returns {Point}
         */
        public perp():Point{
            return p(this.y, -this.x);
        }

        /**
         * 绕着原点逆时针时针旋转90°后得到的点。
         * @returns {Point}
         */
        public rPerp():Point{
            return p(-this.y, this.x);
        }

        /**
         * 获取该点在point点上的投影。
         * @param point
         * @returns {Point}
         */
        public project(point:Point):Point{
            return point.mult(this.dot(point)/point.dot(point));
        }

        /**
         * 绕着某个点旋转的到的新点？ TODO
         * @param point
         * @returns {Point}
         */
        public rotate(point:Point):Point{
            return p(this.x * point.x - this.y * point.y, this.x * point.y + this.y * point.x);
        }
        /**
         * 绕着某个点旋转的到的新点？ TODO
         * @param point
         * @returns {Point}
         */
        public unrotate(point:Point):Point{
            return p(this.x * point.x + this.y * point.y, this.y * point.x - this.x * point.y);
        }

        /**
         * 计算点到原点的距离平方？
         * @returns {number}
         */
        public get lengthSQ():number{
            return this.dot(this);
        }

        /**
         * 到某个点的距离平方。
         * @param point
         * @returns {number}
         */
        public distanceSQTo(point:Point):number{
            return this.sub(point).lengthSQ;
        }

        /**
         * @deprecated
         * @param point
         * @returns {number}
         */
        public distanceSQ(point:Point):number{
            logger.warn("Point#distanceSQ已经废弃，请使用Point#distanceSQTo");
            return this.sub(point).lengthSQ;
        }

        /**
         * 获取点到原点的距离。
         * @returns {number}
         */
        public get length():number{
            return Math.sqrt(this.lengthSQ);
        }

        /**
         * 获取该点到某点的距离。
         * @param point
         * @returns {number}
         */
        public distanceTo(point:Point):number{
            return Math.sqrt(this.distanceSQTo(point));
        }

        /**
         * @deprecated
         * @param point
         * @returns {number}
         */
        public distance(point:Point):number{
            logger.warn("Point#distance已经废弃，请使用Point#distanceTo");
            return Math.sqrt(this.distanceSQTo(point));
        }

        /**
         * 获取单位向量。
         * @returns {Point}
         */
        public normalize():Point{
            return this.mult(1.0 / this.length);
        }

        public toAngle():number{
            return Math.atan2(this.y, this.x);
        }

        //++++++++++++++++工具方法 开始+++++++++++++++

        //++++++++++++++++工具方法 结束+++++++++++++++
        static degreesToRadians (angle:number):number {
            return angle * Math.PI / 180;
        }
        static radiansToDegrees (angle:number):number {
            return angle * (180 / Math.PI);
        }
        static pNeg(point:Point):Point{
            return p(-point.x, -point.y);
        }
        static pAdd(v1:Point, v2:Point):Point{
            return p(v1.x + v2.x, v1.y + v2.y);
        }
        static pSub(v1:Point, v2:Point):Point{
            return p(v1.x - v2.x, v1.y - v2.y);
        }
        static pMult(point:Point, floatVar:number):Point{
            return p(point.x * floatVar, point.y * floatVar);
        }
        static pMidpoint(v1:Point, v2:Point):Point{
            return this.pMult(this.pAdd(v1, v2), 0.5);
        }
        static pDot(v1:Point, v2:Point):number{
            return v1.x * v2.x + v1.y * v2.y;
        }
        static pNormalize(v:Point):Point{
            return this.pMult(v, 1.0 / this.pLength(v));
        }
        static pLength(v:Point):number {
            return Math.sqrt(this.pLengthSQ(v));
        }
        static pLengthSQ(v:Point):number {
            return this.pDot(v, v);
        }
    }

    export function p (x:any, y?:any, resultPoint?:Point):Point {
        var xValue = 0, yValue = 0, result;
        if(arguments.length == 1){
            xValue = x.x;
            yValue = x.y;
        }else if(arguments.length == 2){
            if(typeof y == "number"){
                xValue = x;
                yValue = y;
            }else{
                result = arguments[1];
                xValue = x.x;
                yValue = x.y;
            }
        }else{
            xValue = x;
            yValue = y;
        }
        if(!result){
            result = new Point();
        }
        result._setX(xValue);
        result._setY(yValue);
        return result;
    }
}