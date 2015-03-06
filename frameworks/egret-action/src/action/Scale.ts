/**
 * Created by huanghaiying on 14/12/24.
 */


module egret.action {

    export class ScaleTo extends ActionInterval {

        _startScaleX:number;
        _endScaleX:number;
        _deltaScaleX:number;

        _startScaleY:number;
        _endScaleY:number;
        _deltaScaleY:number;

        constructor() {

            super();
            this._startScaleX = 1;
            this._endScaleX = 0;
            this._startScaleY = 1;
            this._endScaleY = 0;
        }

        public initWithDuration(duration:number, sx, sy):boolean {
            super.initWithDuration(duration);
            this._endScaleX = sx;
            this._endScaleY = (sy != null) ? sy : sx;
            return true;
        }

        /**
         * @param {Number} target
         */
        public startWithTarget(target:DisplayObject) {
            super.startWithTarget(target);
            this._startScaleX = target.scaleX;
            this._startScaleY = target.scaleY;
            this._deltaScaleX = this._endScaleX - this._startScaleX;
            this._deltaScaleY = this._endScaleY - this._startScaleY;
        }

        /**
         * @param {Number} time time in seconds
         */
        public update(time) {
            var dt = super.performEase(time);
            if (this.target) {
                this.target.scaleX = this._startScaleX + this._deltaScaleX * dt;
                this.target.scaleY = this._startScaleY + this._deltaScaleY * dt;
            }
        }

        public clone () {
            var action = new ScaleTo();
            action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
            action.setEase(this._easeFunction);
            return action;
        }

        public static create(duration, sx, sy?) {
            sy = (sy != null) ? sy : sx;

            var rotate = new ScaleTo();
            rotate.initWithDuration(duration, sx, sy);
            return rotate;
        }
    }

    export class ScaleBy extends ScaleTo {

        /**
         * @param {Number} target
         */
        public startWithTarget(target:DisplayObject) {
            super.startWithTarget(target);
            this._deltaScaleX = this._startScaleX * this._endScaleX - this._startScaleX;
            this._deltaScaleY = this._startScaleY * this._endScaleY - this._startScaleY;
        }

        public clone () {
            var action = new ScaleBy();
            action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
            return action;
        }

        public reverse () {
            return ScaleBy.create(this._duration, 1 / this._endScaleX, 1 / this._endScaleY);
        }

        public static create(duration, sx, sy?) {
            sy = (sy != null) ? sy : sx;
            var rotate = new ScaleBy();
            rotate.initWithDuration(duration, sx, sy);
            return rotate;
        }
    }

}