/**
 * Created by Administrator on 2014/12/29.
 */
module mo.action {
    export class BezierBy extends egret.action.ActionInterval {
        __className:string = "BezierBy";
        _config:any;
        _startPosition:any;
        _previousPosition:any;

        /**
         * Constructor
         */
        constructor() {
            super();
            this._config = [];
            this._startPosition = mo.p(0, 0);
            this._previousPosition = mo.p(0, 0);
        }

        /**
         * @param {Number} t time in seconds
         * @param {Array} c Array of points
         * @return {Boolean}
         */
        initWithDuration(t, c) {
            super.initWithDuration(t, c);
            this._config = c;
            return true;
        }

        /**
         * returns a new clone of the action
         * @returns {cc.BezierBy}
         */
        clone():any {
            var action = new BezierBy();
            var newConfigs = [];
            for (var i = 0; i < this._config.length; i++) {
                var selConf = this._config[i];
                newConfigs.push(mo.p(selConf.x, selConf.y));
            }
            action.initWithDuration(this._duration, newConfigs);
            return action;
        }

        /**
         * @param {cc.Node} target
         */
        startWithTarget(target) {
            super.startWithTarget(target);
            var locPosX = target.x;
            var locPosY = target.y;
            this._previousPosition.x = locPosX;
            this._previousPosition.y = locPosY;
            this._startPosition.x = locPosX;
            this._startPosition.y = locPosY;
        }

        /**
         * @param {Number} time
         */
        update(time) {
            if (this.target) {
                var locConfig = this._config;
                var xa = 0;
                var xb = locConfig[0].x;
                var xc = locConfig[1].x;
                var xd = locConfig[2].x;

                var ya = 0;
                var yb = locConfig[0].y;
                var yc = locConfig[1].y;
                var yd = locConfig[2].y;

                var x = this._bezierAt(xa, xb, xc, xd, time);
                var y = this._bezierAt(ya, yb, yc, yd, time);

                var locStartPosition = this._startPosition;
                if (false/*todo cc.ENABLE_STACKABLE_ACTIONS*/) {
                    /*var targetX = this._target.getPositionX();
                     var targetY = this._target.getPositionY();
                     var locPreviousPosition = this._previousPosition;

                     locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
                     locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
                     x = x + locStartPosition.x;
                     y = y + locStartPosition.y;
                     this._target.setPosition(x, y);
                     locPreviousPosition.x = x;
                     locPreviousPosition.y = y;*/
                } else {
                    this.target.x = locStartPosition.x + x;
                    this.target.y = locStartPosition.y + y;
                }
            }
        }

        _bezierAt(a, b, c, d, t):number {
            return (Math.pow(1 - t, 3) * a +
            3 * t * (Math.pow(1 - t, 2)) * b +
            3 * Math.pow(t, 2) * (1 - t) * c +
            Math.pow(t, 3) * d );
        }

        /**
         * @return {cc.ActionInterval}
         */
        reverse() {
            var locConfig = this._config;
            var r = [
                mo.Point.pAdd(locConfig[1], mo.Point.pNeg(locConfig[2])),
                mo.Point.pAdd(locConfig[0], mo.Point.pNeg(locConfig[2])),
                mo.Point.pNeg(locConfig[2])];
            return BezierBy.create(this._duration, r);
        }

        static create(t, c):BezierBy {
            var bezierBy = new BezierBy();
            bezierBy.initWithDuration(t, c);
            return bezierBy;
        }
    }

    /** An action that moves the target with a cubic Bezier curve to a destination point.
     * @class
     * @extends cc.BezierBy
     */
    export class BezierTo extends BezierBy {
        _toConfig:any;

        constructor() {
            super();
            this._toConfig = [];
        }

        /**
         * @param {Number} t time in seconds
         * @param {Array} c Array of points
         * @return {Boolean}
         */
        initWithDuration(t, c) {
            super.initWithDuration(t, c);
            this._toConfig = c;
            return true;
        }

        /**
         * returns a new clone of the action
         * @returns {cc.BezierTo}
         */
        clone():any {
            var action = new BezierTo();
            action.initWithDuration(this._duration, this._toConfig);
            return action;
        }

        /**
         * @param {cc.Node} target
         */
        startWithTarget(target) {
            super.startWithTarget(target);
            var locStartPos = this._startPosition;
            var locToConfig = this._toConfig;
            var locConfig = this._config;

            locConfig[0] = mo.Point.pSub(locToConfig[0], locStartPos);
            locConfig[1] = mo.Point.pSub(locToConfig[1], locStartPos);
            locConfig[2] = mo.Point.pSub(locToConfig[2], locStartPos);
        }

        /**
         * @param {Number} t
         * @param {Array} c array of points
         * @return {mo.BezierTo}
         * @example
         * // example
         * var bezier = [cc.p(0, windowSize.height / 2), cc.p(300, -windowSize.height / 2), cc.p(300, 100)];
         * var bezierTo = cc.BezierTo.create(2, bezier);
         */
        static create(t, c):BezierTo {
            var bezierTo = new BezierTo();
            bezierTo.initWithDuration(t, c);
            return bezierTo;
        }
    }
}

