/**
 * Created by huanghaiying on 14/12/24.
 */


module egret.action {

    export class FadeTo extends ActionInterval {

        _startFade:number;
        _endFade:number;

        constructor() {

            super();

            this._startFade = 0;
            this._endFade = 0;
        }

        public initWithDuration(duration:number, alpha):boolean {
            super.initWithDuration(duration, alpha);
            this._endFade = alpha;
            return true;
        }

        /**
         * @param {Number} target
         */
        public startWithTarget(target:DisplayObject) {
            super.startWithTarget(target);
            this._startFade = target.alpha;
        }

        /**
         * @param {Number} time time in seconds
         */
        public update(time) {
            var dt = super.performEase(time);
            if (this.target) {
                this.target.alpha = this._startFade + (this._endFade - this._startFade) * dt;
            }
        }

        public clone () {
            var action = new FadeTo();
            action.initWithDuration(this._duration, this._endFade);
            return action;
        }

        public static create(duration, opacity) {
            var alpha = opacity / 255;
            alpha = Math.max(0, alpha);
            alpha = Math.min(1, alpha);
            var fadeTo = new FadeTo();
            fadeTo.initWithDuration(duration, alpha);
            return fadeTo;
        }
    }

    export class FadeIn extends FadeTo {
        _reverseAction;

        constructor() {
            super();
            this._reverseAction = null;
        }

        public static create(duration) {
            var rotate = new FadeIn();
            rotate.initWithDuration(duration, 1);
            return rotate;
        }

        /**
         * @return {cc.ActionInterval}
         */
        public reverse () {
            var action = new FadeOut();
            action.initWithDuration(this._duration, 0);
            return action;
        }

        public clone () {
            var action = new FadeIn();
            action.initWithDuration(this._duration, this._endFade);
            return action;
        }

        public startWithTarget (target) {
            if(this._reverseAction)
                this._endFade = this._reverseAction._startFade;
            super.startWithTarget(target);
        }
    }

    export class FadeOut extends FadeTo {
        public static create(duration) {
            var rotate = new FadeOut();
            rotate.initWithDuration(duration, 0);
            return rotate;
        }

        public clone () {
            var action = new FadeOut();
            action.initWithDuration(this._duration, this._endFade);
            return action;
        }

        public reverse () {
            var action = new FadeIn();
            action._reverseAction = this;
            action.initWithDuration(this._duration, 255);
            return action;
        }
    }

}