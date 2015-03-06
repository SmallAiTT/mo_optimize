/**
 * Created by Administrator on 2014/12/29.
 */
module mo_act {
    export class Shake extends egret.action.ActionInterval {
        __className:string = "Shake";
        _initialX:number;
        _initialY:number;
        _strengthX:number;
        _strengthY:number;
        _isInit:boolean;

        constructor() {
            super();
            this._initialX = 0;
            this._initialY = 0;
            this._strengthX = 0;
            this._strengthY = 0;
            this._isInit = false;
        }

        startWithTarget(target) {
            super.startWithTarget(target);

            if (!this._isInit) {
                this._initialX = target.getPositionX();
                this._initialY = target.getPositionY();
                this._isInit = true;
            }
        }

        initWithDuration(duration, strengthX, strengthY) {
            super.initWithDuration(duration)
            this._strengthX = strengthX;
            this._strengthY = strengthY;
            return true;
        }

        update(dt) {
            var randx = this._fgRangeRand(-this._strengthX, this._strengthX) * dt;
            var randy = this._fgRangeRand(-this._strengthY, this._strengthY) * dt;

            // move the target to a shaked position
            this.target.setPosition(this._initialX + randx, this._initialY + randy);
        }

        stop() {
            this.target.setPosition(this._initialX, this._initialY);
            super.stop();
        }

        _fgRangeRand(min, max) {
            return Math.random() * (max - min) + min;
        }

        static create = function (duration:number, strengthX:number, strengthY:number):Shake {
            strengthY = (strengthY == null) ? strengthX : strengthY;
            var ret = new Shake();
            ret.initWithDuration(duration, strengthX, strengthY);
            return ret;
        }
    }


}