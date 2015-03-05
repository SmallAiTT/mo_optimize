/**
 * Created by Administrator on 2015/1/28.
 */

module mo.action {
    export class Track extends egret.action.ActionInterval {
        __className:string = "Track";
        _omega:number = 500;
        _trackTarget:any = null;
        _trackSpeed:number = 0;
        _callback:any = null;
        _callTarget:any = null;

        initWithTarget(trackTarget, trackSpeed, callback,callTarget) {
            this._trackTarget = trackTarget;
            this._trackSpeed = trackSpeed;
            this._callback = callback;
            this._callTarget = callTarget;
        }

        step(dt) {
            var trackTarget = this._trackTarget;
            var moveTarget = this.target;

            var dx = moveTarget.x - trackTarget.x;
            var dy = trackTarget.y - moveTarget.y;

            var angle = (270 + Math.atan2(dy, dx) * 180 / Math.PI) % 360;
            var crtangle = (angle - moveTarget.getRotation() + 360) % 360;
            var dir = crtangle <= 180 ? 1 : -1;

            var rotation = (crtangle < 180 && crtangle > this._omega * dt || crtangle > 180 && 360 - crtangle > this._omega * dt) ?
                (moveTarget.getRotation() + this._omega * dir * dt) : angle;
            var x = this._trackSpeed * Math.sin(rotation * Math.PI / 180) * dt;
            var y = this._trackSpeed * Math.cos(rotation * Math.PI / 180) * dt;

            moveTarget.rotation = rotation;
            moveTarget.x += x;
            moveTarget.y += y;
        }

        /**
         * @return {Boolean}
         */
        isDone() {
            var trackTarget = this._trackTarget;
            var moveTarget = this.target;
            var dx = moveTarget.x - trackTarget.x;
            var dy = moveTarget.y - trackTarget.y;

            var isDone = Math.abs(dx) < 50 && Math.abs(dy) < 50;
            if (isDone) {
                this._duration = 0;
                this._callback && this._callback(this._callTarget);
            }
            return isDone;
        }

        stop() {
            super.stop();
            this._trackTarget = null;
            this._callback = null;
            this._callTarget = null;
        }

        static create(trackTargett:any, trackSpeed:number, callback:any,callTarget:any):Track {
            var ret = new Track();
            ret.initWithTarget(trackTargett, trackSpeed, callback,callTarget);
            return ret;
        }
    }
}