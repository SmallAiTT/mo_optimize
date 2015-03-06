/**
 * Created by huanghaiying on 14/12/24.
 */


module egret.action {

    export class JumpBy extends ActionInterval {

        public _deltaX:number;
        public _deltaY:number;

        public _startX:number;
        public _startY:number;

        public _previousX:number;
        public _previousY;number;


        _height:number;
        _jumps:number;

        constructor() {

            super();

            this._deltaX = 0;
            this._deltaY = 0;
            this._startX = 0;
            this._startY = 0;
            this._previousX = 0;
            this._previousY = 0;
            this._height = 0;
            this._jumps = 0;
        }

        public initWithDuration(duration, x, y, height, jumps):boolean {
            super.initWithDuration(duration, x, y, height, jumps);
            this._deltaX = x;
            this._deltaY = y;
            this._height = height;
            this._jumps = jumps;
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
                var frac = dt * this._jumps % 1.0;
                var y = this._height * 4 * frac * (1 - frac);
                y += this._deltaY * dt;

                var x = this._deltaX * dt;
                var locStartPositionX = this._startX;
                var locStartPositionY = this._startY;
                if (false) {
                    /**cc.ENABLE_STACKABLE_ACTIONS) { todo
                    var targetX = this.target.x;
                    var targetY = this.target.y;
                    var locPreviousPosition = this._previousPosition;

                    locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
                    locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
                    x = x + locStartPosition.x;
                    y = y + locStartPosition.y;

                    this.target.x = x;
                    this.target.y = y;
                    locPreviousPosition.x = x;
                    locPreviousPosition.y = y;*/
                } else {
                    this.target.x = locStartPositionX + x;
                    this.target.y = locStartPositionY + y;
                }
            }

        }

        public static create(duration, x, y, height, jumps) {
            var rotateBy:JumpBy = new JumpBy();
            rotateBy.initWithDuration(duration, x, y, height, jumps);
            return rotateBy;
        }
    }

    export class JumpTo extends JumpBy {

        public _endX:number;
        public _endY:number;

        constructor() {

            super();

            this._endX = 0;
            this._endY = 0;
        }

        public initWithDuration(duration, x, y, height, jumps):boolean {
            super.initWithDuration(duration, x, y, height, jumps);
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

        public static create(duration, x, y, height, jumps) {
            var rotate:JumpTo = new JumpTo();
            rotate.initWithDuration(duration, x, y, height, jumps);
            return rotate;
        }
    }

}

