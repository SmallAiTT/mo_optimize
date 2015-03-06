module mo_act {
    export class ProgressTo extends egret.action.ActionInterval {
        __className:string = "ProgressTo";
        _to = 0;
        _from = 0;

        constructor() {
            super();
            this._to = 0;
            this._from = 0;
        }

        startWithTarget(target) {
            super.startWithTarget(target);

            this._from = target.getPercent();

            if (this._from == 100)
                this._from = 0;
        }

        initWithDuration(duration, percent) {
            super.initWithDuration(duration);
            this._to = percent;
            return true;
        }

        update(dt) {
            //if (this.target  instanceof UILoadingBar) TODO
                this.target.setPercent(this._from + (this._to - this._from) * dt);
        }

        clone() {
            var action = new ProgressTo();
            action.initWithDuration(this._duration, this._to);
            return action;
        }

        static create = function (duration, percent):ProgressTo {
            var progressTo = new ProgressTo();
            progressTo.initWithDuration(duration, percent);
            return progressTo;
        }
    }


    export class ProgressFromTo extends egret.action.ActionInterval {
        __className:string = "ProgressFromTo";
        _to = 0;
        _from = 0;

        constructor() {
            super();
            this._to = 0;
            this._from = 0;
        }

        initWithDuration(duration, fromPercentage, toPercentage) {
            super.initWithDuration(duration);
            this._to = toPercentage;
            this._from = fromPercentage;
            return true;
        }

        update(dt) {
            //if (this.target instanceof UILoadingBar) TODO
                this.target.setPercent(this._from + (this._to - this._from) * dt);
        }

        clone() {
            var action = new ProgressFromTo();
            action.initWithDuration(this._duration, this._from, this._to);
            return action;
        }

        reverse () {
            return ProgressFromTo.create(this._duration, this._to, this._from);
        }

        static create = function (duration, fromPercentage, toPercentage):ProgressFromTo {
            var progressTo = new ProgressFromTo();
            progressTo.initWithDuration(duration, fromPercentage, toPercentage);
            return progressTo;
        }
    }
}