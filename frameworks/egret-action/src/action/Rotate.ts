/**
 * Created by huanghaiying on 14/12/24.
 */


module egret.action {

    export class RotateBy extends ActionInterval {

        _startAngle:number;
        _diffAngle:number;

        constructor() {

            super();

            this._startAngle = 0;
            this._diffAngle = 0;
        }

        public initWithDuration(duration:number, rotate?):boolean {
            super.initWithDuration(duration, rotate);
            this._diffAngle = rotate;
            return true;
        }

        /**
         * @param {Number} target
         */
        public startWithTarget(target:DisplayObject) {
            super.startWithTarget(target);
            this._startAngle = target._rotation;
        }

        /**
         * @param {Number} time time in seconds
         */
        public update(time) {
            var dt = super.performEase(time);
            if (this.target) {
                this.target.rotation = this._startAngle + this._diffAngle * dt;
            }
        }

        /**
         * returns a new clone of the action
         * @returns {cc.RotateBy}
         */
        public clone(): Action {
            var action = new RotateBy();
            action.initWithDuration(this._duration, this._diffAngle);
            return action;
        }

        reverse () {
            return RotateBy.create(this._duration, -this._diffAngle);
        }

        public static create(duration, rotate) {
            var rotateBy:RotateBy = new RotateBy();
            rotateBy.initWithDuration(duration, rotate);
            return rotateBy;
        }
    }

    export class RotateTo extends ActionInterval {

        _startAngle:number;
        _desAngle:number;

        constructor() {
            super();
            this._startAngle = 0;
            this._desAngle = 0;
        }

        public initWithDuration(duration:number, rotate?):boolean {
            super.initWithDuration(duration, rotate);
            this._desAngle = rotate;
            return true;
        }

        /**
         * @param {Number} target
         */
        public startWithTarget(target:DisplayObject) {
            super.startWithTarget(target);
            this._startAngle = target._rotation;
        }

        /**
         * @param {Number} time time in seconds
         */
        public update(time) {
            var dt = super.performEase(time);
            if (this.target) {
                this.target.rotation = this._startAngle + (this._desAngle - this._startAngle) * dt;
            }
        }

        /**
         * returns a new clone of the action
         * @returns {cc.RotateTo}
         */
        public clone(): Action{
            var action = new RotateTo();
            action.initWithDuration(this._duration, this._desAngle);
            return action;
        }

        /**
         * RotateTo reverse not implemented
         */
        public reverse () {
            console.warn("cc.RotateTo.reverse(): it should be overridden in subclass.");
        }

        public static create(duration, deltaRotation) {
            var rotate:RotateTo = new RotateTo();
            rotate.initWithDuration(duration, deltaRotation);
            return rotate;
        }
    }

}