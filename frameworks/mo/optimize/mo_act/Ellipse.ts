module mo.action {
    export class Ellipse extends egret.action.ActionInterval{
        static __className:string = "Ellipse";
        _centerPosition:Point;
        _aLength:number;
        _cLength:number;

        startWithTarget (target) {
            super.startWithTarget(target);
        }

        initWithDuration (duration, centerPosition, aLength, cLength) {
            super.initWithDuration.call(this, duration);
            this._centerPosition = centerPosition;
            this._aLength = aLength;
            this._cLength = cLength;
            return true;
        }

        update (dt) {
            if (this.target) {
                var startPosition = this._centerPosition;//中心点坐标
                var a = this._aLength;
                var bx = this._centerPosition.x;
                var by = this._centerPosition.y;
                var c = this._cLength;
                var x = this._ellipseX(a, bx, c, dt);//调用之前的坐标计算函数来计算出坐标值
                var y = this._ellipseY(a, by, c, dt);
                this.target.setPosition(mo.Point.pAdd(startPosition, p(x - a, y)));//由于我们画计算出的椭圆你做值是以原点为中心的，所以需要加上我们设定的中心点坐标
            }
        }

        _ellipseX (a, by, c, dt) {
            return -a * Math.cos(2 * Math.PI * dt) + a; //参数方程
        }

        _ellipseY (a, by, c, dt) {
            var b = Math.sqrt(Math.pow(a, 2) - Math.pow(c, 2));//因为之前定义的参数是焦距c而不是短半轴b，所以需要计算出b
            return b * Math.sin(2 * Math.PI * dt);
        }

        static create (duration, centerPosition, aLength, cLength):Ellipse {
            var ret = new Ellipse();
            ret.initWithDuration(duration, centerPosition, aLength, cLength);
            return ret;
        }
    }
}