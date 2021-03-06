module mo_act{
    export class Ease {
        constructor() {
            egret.Logger.fatalWithErrorId(1014);
        }

        public static get(amount):Function {
            if (amount < -1) {
                amount = -1;
            }
            if (amount > 1) {
                amount = 1;
            }
            return function (t) {
                if (amount == 0) {
                    return t;
                }
                if (amount < 0) {
                    return t * (t * -amount + 1 + amount);
                }
                return t * ((2 - t) * amount + (1 - amount));
            }
        }

        public static getPowIn(pow):Function {
            return function (t) {
                return Math.pow(t, pow);
            }
        }

        public static getPowOut(pow):Function {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            }
        }

        public static getPowInOut(pow):Function {
            return function (t) {
                if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
                return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            }
        }

        public static quadIn = Ease.getPowIn(2);
        public static quadOut = Ease.getPowOut(2);
        public static quadInOut = Ease.getPowInOut(2);
        public static cubicIn = Ease.getPowIn(3);
        public static cubicOut = Ease.getPowOut(3);
        public static cubicInOut = Ease.getPowInOut(3);
        public static quartIn = Ease.getPowIn(4);
        public static quartOut = Ease.getPowOut(4);
        public static quartInOut = Ease.getPowInOut(4);
        public static quintIn = Ease.getPowIn(5);
        public static quintOut = Ease.getPowOut(5);
        public static quintInOut = Ease.getPowInOut(5);

        public static sineIn(t):number {
            return 1 - Math.cos(t * Math.PI / 2);
        }

        public static sineOut(t):number {
            return Math.sin(t * Math.PI / 2);
        }

        public static sineInOut(t):number {
            return -0.5 * (Math.cos(Math.PI * t) - 1)
        }

        public static getBackIn(amount):Function {
            return function (t) {
                return t * t * ((amount + 1) * t - amount);
            }
        }

        public static backIn = Ease.getBackIn(1.7);

        public static getBackOut(amount):Function {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            }
        }

        public static backOut = Ease.getBackOut(1.7);

        public static getBackInOut(amount):Function {
            amount *= 1.525;
            return function (t) {
                if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
                return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
            }
        }

        public static backInOut = Ease.getBackInOut(1.7);

        public static circIn(t):number {
            return -(Math.sqrt(1 - t * t) - 1);
        }

        public static circOut(t):number {
            return Math.sqrt(1 - (--t) * t);
        }

        public static circInOut(t):number {
            if ((t *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        }

        public static bounceIn(t):number {
            return 1 - Ease.bounceOut(1 - t);
        }

        public static bounceOut(t):number {
            if (t < 1 / 2.75) {
                return (7.5625 * t * t);
            } else if (t < 2 / 2.75) {
                return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            } else if (t < 2.5 / 2.75) {
                return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            } else {
                return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }
        }

        public static bounceInOut(t):number {
            if (t < 0.5) return Ease.bounceIn(t * 2) * .5;
            return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        }

        public static getElasticIn(amplitude, period):Function {
            var pi2 = Math.PI * 2;
            return function (t) {
                if (t == 0 || t == 1) return t;
                var s = period / pi2 * Math.asin(1 / amplitude);
                return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            }
        }

        public static elasticIn = Ease.getElasticIn(1, 0.3);

        public static getElasticOut(amplitude, period):Function {
            var pi2 = Math.PI * 2;
            return function (t) {
                if (t == 0 || t == 1) return t;
                var s = period / pi2 * Math.asin(1 / amplitude);
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
            }
        }

        public static elasticOut = Ease.getElasticOut(1, 0.3);

        public static getElasticInOut(amplitude, period):Function {
            var pi2 = Math.PI * 2;
            return function (t) {
                var s = period / pi2 * Math.asin(1 / amplitude);
                if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
                return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
            }
        }

        public static elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
    }
}