/**
 * Created by wander on 14-12-22.
 */
module egret.action {

    export class MoveBy extends ActionInterval {
        public _deltaX:number;
        public _startX:number;
        private _previousX:number;

        public _deltaY:number;
        public _startY:number;
        private _previousY:number;

        constructor() {

            super();

            this._deltaX = 0;
            this._startX = 0;
            this._previousX = 0;
            this._deltaY = 0;
            this._startY = 0;
            this._previousY = 0;
        }

        public initWithDuration(duration:number, x, y):boolean {
            super.initWithDuration(duration, x, y);
            this._deltaX = x;
            this._deltaY = y;
            return true;
        }

        /**
         * @param {Number} target
         */
        public startWithTarget(target:DisplayObject) {
            super.startWithTarget(target);
            var locPosX = target.x;
            var locPosY = target.y;
            this._previousX = locPosX;
            this._previousY = locPosY;
            this._startX = locPosX;
            this._startY = locPosY;
        }


        /**
         * @param {Number} time time in seconds
         */
        public update(time) {
            var dt = super.performEase(time);
            if (this.target) {
                var x = this._deltaX * dt;
                var y = this._deltaY * dt;
                var locStartPositionX = this._startX;
                var locStartPositionY = this._startY;
                if (false) {//cc.ENABLE_STACKABLE_ACTIONS) { todo
//                var targetX = this._target.getPositionX();
//                var targetY = this._target.getPositionY();
//                var locPreviousPosition = this._previousPosition;
//
//                locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
//                locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
//                x = x + locStartPosition.x;
//                y = y + locStartPosition.y;
//
//                this._target.setPosition(x, y);
//                locPreviousPosition.x = x;
//                locPreviousPosition.y = y;
                } else {
                    this.target.x = locStartPositionX + x;
                    this.target.y = locStartPositionY + y;
                }
            }
        }

        public clone () {
            var action = new MoveBy();
            action.initWithDuration(this._duration, this._deltaX, this._deltaY)
            return action;
        }

        /**
         * MoveTo reverse is not implemented
         */
        public reverse () {
            return MoveBy.create(this._duration, -this._deltaX, -this._deltaY);
        }

        public static create(duration, x, y) {
            var moveBy = new MoveBy();
            moveBy.initWithDuration(duration, x, y);
            return moveBy;
        }
    }


    export class MoveTo extends MoveBy {

        public _endX:number;
        public _endY:number;

        constructor() {

            super();

            this._endX = 0;
            this._endY = 0;
        }

        public initWithDuration(duration:number, x, y):boolean {
            super.initWithDuration(duration, x, y);
            this._endX = x;
            this._endY = y;
            return true;
        }

        /**
         * @param {Number} target
         */
        public startWithTarget(target:DisplayObject) {
            super.startWithTarget(target);

            this._deltaX = this._endX - this._startX;
            this._deltaY = this._endY - this._startY;
        }

        public clone() {
            var action = new MoveTo();
            action.initWithDuration(this._duration, this._endX, this._endY);
            return action;
        }

        public static create(duration, x, y) {
            var rotate = new MoveTo();
            rotate.initWithDuration(duration, x, y);
            return rotate;
        }
    }
}